ALTER TABLE purchases
    ADD COLUMN house_share_id INTEGER NOT NULL DEFAULT 1,
    ADD FOREIGN KEY (house_share_id) REFERENCES house_share(id);