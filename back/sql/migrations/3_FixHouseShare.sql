ALTER TABLE house_share
    DROP CONSTRAINT house_share_manager_id_fkey,
    ADD CONSTRAINT house_share_manager_id_fkey
        FOREIGN KEY (manager_id)
        REFERENCES users (id)
        ON DELETE RESTRICT;