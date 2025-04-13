CREATE OR REPLACE FUNCTION stay_dates_check() RETURNS TRIGGER AS
$$
BEGIN
    IF EXISTS(SELECT id
              FROM stays
              WHERE NEW.user_id = user_id
                AND NEW.id != id
                AND NEW.exit_date IS NULL AND exit_date IS NULL) THEN
        RAISE EXCEPTION 'A stay already exists with overlapping dates where both exit dates are NULL';
    END IF;

    IF EXISTS(SELECT id
              FROM stays
              WHERE NEW.user_id = user_id
                AND NEW.id != id
                AND NEW.exit_date IS NOT NULL AND NEW.exit_date BETWEEN entry_date AND COALESCE(exit_date, now())) THEN
        RAISE EXCEPTION 'A stay already exists with overlapping dates for the provided exit date';
    END IF;

    IF EXISTS(SELECT id
              FROM stays
              WHERE NEW.user_id = user_id
                AND NEW.id != id
                AND NEW.entry_date BETWEEN entry_date AND COALESCE(exit_date, now())) THEN
        RAISE EXCEPTION 'A stay already exists with overlapping dates for the provided entry date';
    END IF;

    IF EXISTS(SELECT id
              FROM stays
              WHERE NEW.user_id = user_id
                AND NEW.id != id
                AND NEW.entry_date > entry_date AND exit_date IS NULL) THEN
        RAISE EXCEPTION 'A stay already exists with an open-ended exit date and a later entry date';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER stay_dates_check
    BEFORE INSERT OR UPDATE
    ON stays
    FOR EACH ROW
EXECUTE FUNCTION stay_dates_check();

ALTER TABLE stays
    ADD CHECK ( entry_date < exit_date OR exit_date IS NULL );

-- A house share can have no manager if it's an ended house share
ALTER TABLE house_share
    ALTER COLUMN manager_id DROP NOT NULL;
-- Add a constraint to ensure that a manager can't manage multiple house shares
ALTER TABLE house_share
    ADD CONSTRAINT unique_manager_id UNIQUE (manager_id);

ALTER TABLE contributions
    ADD CHECK ( amount > 0 );
ALTER TABLE transfers
    ADD CHECK ( amount > 0 ),
    ADD CHECK ( sender_id != receiver_id );

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

CREATE TRIGGER contributions_checks
    BEFORE INSERT OR UPDATE
    ON contributions
    FOR EACH ROW
EXECUTE FUNCTION contributions_checks();

CREATE FUNCTION purchases_checks() RETURNS TRIGGER AS
$$
BEGIN
    IF (SELECT house_share.id
        FROM shared_fund
                 INNER JOIN house_share ON shared_fund.house_share_id = house_share.id
        WHERE shared_fund.id = NEW.shared_fund_id)
        NOT IN
       (SELECT house_share_id
        FROM stays
        WHERE user_id = NEW.user_id
          AND NEW.date BETWEEN entry_date AND COALESCE(exit_date, now())) THEN
        RAISE EXCEPTION 'The user cannot make a purchase if he is not staying in the house share';
    end if;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER purchases_checks
    BEFORE INSERT OR UPDATE
    ON purchases
    FOR EACH ROW
EXECUTE FUNCTION purchases_checks();

ALTER TABLE shared_fund
    ADD UNIQUE (house_share_id);