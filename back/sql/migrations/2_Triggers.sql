CREATE FUNCTION stay_dates_check() RETURNS TRIGGER AS
$$
BEGIN
    -- An entry_date must be before exit_date
    IF NEW.exit_date IS NOT NULL AND NEW.exit_date < NEW.entry_date THEN
        RAISE EXCEPTION 'exit_date must be greater than entry_date';
    END IF;
    -- A user can't stay in two places at the same time
    IF NEW.exit_date IS NULL AND EXISTS((SELECT id
                                          FROM stays
                                          WHERE user_id = NEW.user_id
                                            AND (exit_date IS NULL OR exit_date >= NEW.exit_date))) THEN
        RAISE EXCEPTION 'User is already staying somewhere else';
    END IF;
    -- A user can't stay in a place in the past compared to his last stay
    IF NEW.entry_date < (SELECT COALESCE(MAX(exit_date), '1970-01-01'::DATE) -- If there is no previous stay, we consider the epoch
                         FROM stays
                         WHERE user_id = NEW.user_id) THEN
        RAISE EXCEPTION 'User can''t stay in a place in the past compared to his last stay';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER stay_dates_check
    BEFORE INSERT OR UPDATE
    ON stays
    FOR EACH ROW
EXECUTE FUNCTION stay_dates_check();

-- A house share can have no manager if it's an ended house share
ALTER TABLE house_share
    ALTER COLUMN manager_id DROP NOT NULL;
-- Add a constraint to ensure that a manager can't manage multiple house shares
ALTER TABLE house_share
    ADD CONSTRAINT unique_manager_id UNIQUE (manager_id);

