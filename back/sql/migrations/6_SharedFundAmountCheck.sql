-- Fonction pour calculer le montant de la cagnotte basée sur les contributions et les achats
CREATE OR REPLACE FUNCTION update_shared_fund_amount()
    RETURNS TRIGGER AS
$$
DECLARE
    calculated_amount DECIMAL(10, 2);
BEGIN
    -- Calculer le montant total des contributions pour cette cagnotte
    SELECT COALESCE(SUM(amount), 0)
    INTO calculated_amount
    FROM contributions
    WHERE shared_fund_id = NEW.shared_fund_id;

    -- Soustraire le montant total des achats effectués avec cette cagnotte
    SELECT calculated_amount - COALESCE(SUM(amount), 0)
    INTO calculated_amount
    FROM purchases
    WHERE shared_fund_id = NEW.shared_fund_id;

    -- Si le montant calculé diffère du montant actuel, mettre à jour
    UPDATE shared_fund
    SET amount = calculated_amount
    WHERE id = NEW.shared_fund_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour les contributions
DROP TRIGGER IF EXISTS update_shared_fund_amount_on_contribution ON contributions;
CREATE TRIGGER update_shared_fund_amount_on_contribution
    AFTER INSERT OR UPDATE OR DELETE
    ON contributions
    FOR EACH ROW
EXECUTE FUNCTION update_shared_fund_amount();

-- Trigger pour les achats
DROP TRIGGER IF EXISTS update_shared_fund_amount_on_purchase ON purchases;
CREATE TRIGGER update_shared_fund_amount_on_purchase
    AFTER INSERT OR UPDATE OR DELETE
    ON purchases
    FOR EACH ROW
EXECUTE FUNCTION update_shared_fund_amount();