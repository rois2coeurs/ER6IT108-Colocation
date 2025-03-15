-- Insert colocations
INSERT INTO tblColocation (PK_idColocation, name, address, city, postal_code, FK_Administrator)
VALUES (1, 'Coloc des Amis', '123 Rue du Bonheur', 'Paris', '75001', 1);

INSERT INTO tblColocation (PK_idColocation, name, address, city, postal_code, FK_Administrator)
VALUES (2, 'La Maison Bleue', '45 Avenue des Fleurs', 'Lyon', '69001', 2);

INSERT INTO tblColocation (PK_idColocation, name, address, city, postal_code, FK_Administrator)
VALUES (3, 'Appart Sympa', '78 Boulevard du Soleil', 'Marseille', '13001', 3);


-- Create pots (cagnottes) for each colocation
INSERT INTO tblPot (PK_idPot, sum, FK_IdColocation)
VALUES (1, 0.00, 1);

INSERT INTO tblPot (PK_idPot, sum, FK_IdColocation)
VALUES (2, 0.00, 2);

INSERT INTO tblPot (PK_idPot, sum, FK_IdColocation)
VALUES (3, 0.00, 3);


-- Sojourns for the first members/who are the administrators of the colocations
INSERT INTO tblSojourn (PK_idSojourn, dateEntry, dateExit, FK_IdPerson, FK_IdColocation)
VALUES (1, '2025-01-01', NULL, 1, 1);

INSERT INTO tblSojourn (PK_idSojourn, dateEntry, dateExit, FK_IdPerson, FK_IdColocation)
VALUES (2, '2025-01-01', NULL, 2, 2);

INSERT INTO tblSojourn (PK_idSojourn, dateEntry, dateExit, FK_IdPerson, FK_IdColocation)
VALUES (3, '2025-01-01', NULL, 3, 3);


-- A little Abundance from the first admiunistrator
INSERT INTO tblAbundance (PK_idAbundance, FK_IdPerson, FK_IdPot, date, amount)
VALUES (1, 1, 1, '2025-01-02', 10.00);

-- A little Payment (Versement) from the first admiunistrator too
INSERT INTO tblPayment (PK_idPayment, FK_IdPersonSender, FK_IdPersonReceiver, date, amount)
VALUES (1, 1, 2, '2025-01-03', 5.00);

-- A little Achat from the first admiunistrator too
INSERT INTO tblAchat (PK_idAchat, title, amount, date, FK_IdPot, FK_IdPerson)
VALUES (1, 'Crousty', 15.00, '2025-01-04', 1, 1);