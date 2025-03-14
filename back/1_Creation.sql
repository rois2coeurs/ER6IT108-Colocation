
CREATE TABLE tblPerson (  -- Personne/Membre (Admin, Manager, Membre)
    PK_idPerson INT PRIMARY KEY,
    name VARCHAR(100),
    surname VARCHAR(100),
    mail VARCHAR(100),
    telephone_number CHAR(10) NULL CHECK(telephone_number LIKE ('[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'))
    password VARCHAR(100),
    is_admin BOOLEAN,
    is_manager BOOLEAN,
    FK_IdColocation INT,
    FOREIGN KEY (FK_IdColocation) REFERENCES tblColocation(idColocation)
);

CREATE TABLE tblColocation ( -- Colocation
    PK_idColocation INT PRIMARY KEY,
    name VARCHAR(100),
    address VARCHAR(100),
    city VARCHAR(100),
    postal_code CHAR(5) CHECK(postal_code LIKE ('[0-9][0-9][0-9][0-9][0-9]')),
    FK_Administrator INT,
    FOREIGN KEY (FK_Administrator) REFERENCES tblPerson(idPerson)
);

CREATE TABLE tblAchat ( -- Achat
    PK_idAchat INT PRIMARY KEY,
    title VARCHAR(100),
    amount DECIMAL(10,2),
    date DATE,
    FK_IdPot INT,
    FK_IdPerson INT,
    FOREIGN KEY (FK_IdPot) REFERENCES tblPot(idPot)
    FOREIGN KEY (FK_IdPerson) REFERENCES tblPerson(idPerson)
);

CREATE TABLE tblPot ( -- Cagnotte
    PK_idPot INT PRIMARY KEY,
    sum DECIMAL(10,2),
    FK_IdColocation INT,
    FOREIGN KEY (FK_IdColocation) REFERENCES tblColocation(idColocation)
);

CREATE TABLE tblAbundance ( -- Abondement
    PK_idAbundance INT PRIMARY KEY,
    FK_IdPerson INT,
    FK_IdPot INT,
    date DATE,
    amount DECIMAL(10,2),
    FOREIGN KEY (FK_IdPerson) REFERENCES tblPerson(idPerson)
    FOREIGN KEY (FK_IdPot) REFERENCES tblPot(idPot)
);

CREATE TABLE tblPayment ( -- Versement
    PK_idPayment INT PRIMARY KEY,
    FK_IdPersonSender INT,
    FK_IdPersonReceiver INT,
    date DATE,
    amount DECIMAL(10,2),
    FOREIGN KEY (FK_IdPersonSender) REFERENCES tblPerson(idPerson),
    FOREIGN KEY (FK_IdPersonReceiver) REFERENCES tblPerson(idPerson)
)

CREATE TABLE tblSojourn ( -- Séjourner
    PK_idSojourn INT PRIMARY KEY,
    dateEntry DATE,
    dateExit DATE,
    FK_IdPerson INT,
    FK_IdColocation INT,
    FOREIGN KEY (FK_IdPerson) REFERENCES tblPerson(idPerson),
    FOREIGN KEY (FK_IdColocation) REFERENCES tblColocation(idColocation)
)