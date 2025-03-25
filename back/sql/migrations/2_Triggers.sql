CREATE FUNCTION stay_dates_check() RETURNS TRIGGER AS
$$
BEGIN
    IF EXISTS(SELECT id
              FROM stays
              WHERE NEW.user_id = user_id
                AND ((NEW.exit_date IS NULL AND exit_date IS NOT NULL)
                  OR (NEW.exit_date IS NOT NULL AND NEW.exit_date BETWEEN entry_date AND exit_date)
                  OR (NEW.entry_date BETWEEN entry_date AND exit_date)))
    THEN
        RAISE EXCEPTION 'A stay already exists for this period or user is already staying somewhere else';
    END IF;
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

