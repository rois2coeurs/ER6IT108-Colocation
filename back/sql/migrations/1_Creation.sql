CREATE TABLE users -- Personne/Membre (Admin, Manager, Membre)
(
    id           INT PRIMARY KEY,
    name         VARCHAR(50)  NOT NULL,
    firstname    VARCHAR(50)  NOT NULL,
    mail         VARCHAR(100) NOT NULL UNIQUE,
    password     CHAR(118)    NOT NULL, -- Hashed password (argon2)
    is_admin     BOOLEAN      NOT NULL DEFAULT FALSE,
    phone_number VARCHAR(15) CHECK (phone_number LIKE ('\+?[1-9][0-9]{7,14}'))
);

CREATE TABLE house_share -- Colocation
(
    id         INT PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    address    VARCHAR(255) NOT NULL,
    manager_id INT          NOT NULL REFERENCES house_share (id)
);

CREATE TABLE shared_found -- Cagnotte
(
    id             INT PRIMARY KEY,
    amount         DECIMAL(10, 2) NOT NULL DEFAULT 0,
    house_share_id INT            NOT NULL REFERENCES house_share (id)
);

CREATE TABLE purchases -- Achat
(
    id             INT PRIMARY KEY,
    title          VARCHAR(100)   NOT NULL,
    amount         DECIMAL(10, 2) NOT NULL,
    date           DATE           NOT NULL,
    shared_fund_id INT            NOT NULL REFERENCES shared_found (id),
    user_id        INT            NOT NULL REFERENCES users (id)
);

CREATE TABLE contributions -- Abondement
(
    id              INT PRIMARY KEY,
    user_id         INT            NOT NULL REFERENCES users (id),
    shared_found_id INT            NOT NULL REFERENCES shared_found (id),
    date            DATE           NOT NULL,
    amount          DECIMAL(10, 2) NOT NULL
);

CREATE TABLE transfers -- Versement
(
    id          INT PRIMARY KEY,
    sender_id   INT            NOT NULL REFERENCES users (id),
    receiver_id INT            NOT NULL REFERENCES users (id),
    date        DATE           NOT NULL,
    amount      DECIMAL(10, 2) NOT NULL
);

CREATE TABLE stays -- Séjourner
(
    id             INT PRIMARY KEY,
    entry_date     DATE NOT NULL,
    exit_date      DATE,
    user_id        INT  NOT NULL REFERENCES users (id),
    house_share_id INT  NOT NULL REFERENCES house_share (id)
);