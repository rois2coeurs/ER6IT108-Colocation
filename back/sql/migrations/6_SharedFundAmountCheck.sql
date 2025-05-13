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
    WHEN (NEW.shared_fund_id IS NOT NULL OR OLD.shared_fund_id IS NOT NULL)
EXECUTE FUNCTION update_shared_fund_amount();

-- Modification de la fonction de contribution existante pour ne plus mettre à jour directement le montant de la cagnotte,
-- puisque le trigger s'en charge maintenant
CREATE OR REPLACE FUNCTION contributions_checks() RETURNS TRIGGER AS
$$
BEGIN
    IF ((SELECT house_share_id
         FROM shared_fund
         WHERE id = NEW.shared_fund_id) NOT IN
        (SELECT house_share_id
         FROM stays
         WHERE user_id = NEW.user_id
           AND NEW.date BETWEEN entry_date AND COALESCE(exit_date, now())))
    THEN
        RAISE EXCEPTION 'The user cannot contribute to a shared fund if he is not staying in the house share';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;