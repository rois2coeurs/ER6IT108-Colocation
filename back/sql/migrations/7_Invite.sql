CREATE TABLE invites
(
    id             SERIAL PRIMARY KEY,
    user_id        INT  NOT NULL REFERENCES users (id),
    house_share_id INT  NOT NULL REFERENCES house_share (id),
    date           DATE NOT NULL DEFAULT CURRENT_DATE,
    status         VARCHAR(20) CHECK (status IN ('pending', 'accepted', 'declined', 'cancelled')) DEFAULT 'pending'
);
