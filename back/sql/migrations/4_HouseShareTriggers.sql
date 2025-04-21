CREATE OR REPLACE FUNCTION check_stays_before_remove_manager()
    RETURNS TRIGGER AS
$$
BEGIN
    IF (OLD.manager_id IS NOT NULL AND NEW.manager_id IS NULL) THEN
        IF EXISTS (SELECT 1
                   FROM stays s
                   WHERE s.house_share_id = NEW.id
                     AND s.user_id != OLD.manager_id
                     AND s.exit_date IS NULL) THEN
            RAISE EXCEPTION 'Cannot remove house manager while there are active stays from other users';
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_stays_before_remove_manager_trigger
    BEFORE UPDATE OF manager_id
    ON house_share
    FOR EACH ROW
EXECUTE FUNCTION check_stays_before_remove_manager();