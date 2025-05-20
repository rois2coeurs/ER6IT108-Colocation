CREATE TABLE purchases_targets
(
    purchase_id INT NOT NULL REFERENCES purchases(id),
    user_id     INT NOT NULL REFERENCES users(id),
    PRIMARY KEY (purchase_id, user_id)
);
