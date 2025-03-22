CREATE FUNCTION stay_dates_check() RETURNS TRIGGER AS
$$
BEGIN
    IF NEW.exit_date IS NOT NULL AND NEW.exit_date < NEW.entry_date THEN
        RAISE EXCEPTION 'exit_date must be greater than entry_date';
    END IF;
    IF NEW.exist_date IS NULL AND EXISTS((SELECT id
                                          FROM stays
                                          WHERE user_id = NEW.user_id
                                            AND (exit_date IS NULL OR exit_date >= NEW.exit_date))) THEN
        RAISE EXCEPTION 'User is already staying somewhere else';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER stay_dates_check
    BEFORE INSERT OR UPDATE
    ON stays
    FOR EACH ROW
EXECUTE FUNCTION stay_dates_check();


CREATE FUNCTION house_share_manager_check() RETURNS TRIGGER AS
$$
BEGIN
    -- Check if manager_id is not in another active house_share
    IF EXISTS((SELECT house_share_id
               FROM house_share_active
               WHERE house_share_id = NEW.manager_id)) THEN
        RAISE EXCEPTION 'Manager is already managing another house_share';
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER house_share_manager_check
    BEFORE INSERT OR UPDATE
    ON house_share
    FOR EACH ROW
EXECUTE FUNCTION house_share_manager_check();


CREATE VIEW house_share_active AS
(
SELECT house_share_id
FROM stays
WHERE exit_date IS NULL
GROUP BY house_share_id
    );
