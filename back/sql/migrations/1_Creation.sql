CREATE TABLE users -- Personne/Membre (Admin, Manager, Membre)
(
    id           SERIAL PRIMARY KEY,
    name         VARCHAR(50)  NOT NULL,
    firstname    VARCHAR(50)  NOT NULL,
    mail         VARCHAR(100) NOT NULL UNIQUE,
    password     CHAR(118)    NOT NULL, -- Hashed password (argon2)
    is_admin     BOOLEAN      NOT NULL DEFAULT FALSE,
    phone_number VARCHAR(16) CHECK (phone_number ~ ('\+?[0-9]{7,15}'))
);

CREATE TABLE house_share -- Colocation
(
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    address    VARCHAR(255) NOT NULL,
    manager_id INT          NOT NULL REFERENCES house_share (id)
);

CREATE TABLE shared_fund -- Cagnotte
(
    id             SERIAL PRIMARY KEY,
    amount         DECIMAL(10, 2) NOT NULL DEFAULT 0,
    house_share_id INT            NOT NULL REFERENCES house_share (id)
);

CREATE TABLE purchases -- Achat
(
    id             SERIAL PRIMARY KEY,
    title          VARCHAR(100)   NOT NULL,
    amount         DECIMAL(10, 2) NOT NULL,
    date           DATE           NOT NULL,
    shared_fund_id INT            REFERENCES shared_fund (id),
    user_id        INT            NOT NULL REFERENCES users (id)
);

CREATE TABLE contributions -- Abondement
(
    id             SERIAL PRIMARY KEY,
    user_id        INT            NOT NULL REFERENCES users (id),
    shared_fund_id INT            NOT NULL REFERENCES shared_fund (id),
    date           DATE           NOT NULL,
    amount         DECIMAL(10, 2) NOT NULL
);

CREATE TABLE transfers -- Versement
(
    id          SERIAL PRIMARY KEY,
    sender_id   INT            NOT NULL REFERENCES users (id),
    receiver_id INT            NOT NULL REFERENCES users (id),
    date        DATE           NOT NULL,
    amount      DECIMAL(10, 2) NOT NULL
);

CREATE TABLE stays -- Séjourner
(
    id             SERIAL PRIMARY KEY,
    entry_date     DATE NOT NULL,
    exit_date      DATE,
    user_id        INT  NOT NULL REFERENCES users (id),
    house_share_id INT  NOT NULL REFERENCES house_share (id)
);