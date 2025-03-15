-- Admin users
INSERT INTO tblPerson (PK_idPerson, name, surname, mail, telephone_number, password, is_manager, FK_IdColocation)
VALUES (1, 'Nicolas', 'Thongphao', 'nicolas.thongphao@gmail.com', '0612345678', 'password', TRUE, NULL);

INSERT INTO tblPerson (PK_idPerson, name, surname, mail, telephone_number, password, is_manager, FK_IdColocation)
VALUES (2, 'Valentin', 'Raillard', 'valentin.raillard@coloc.com', '0612345678', 'password', TRUE, NULL);

INSERT INTO tblPerson (PK_idPerson, name, surname, mail, telephone_number, password, is_manager, FK_IdColocation)
VALUES (3, 'Admin', 'Test', 'admin.test@gmail.com', '0678901234', 'password', TRUE, NULL);


-- Regular members for first colocation
INSERT INTO tblPerson (PK_idPerson, name, surname, mail, telephone_number, password, is_manager, FK_IdColocation)
VALUES (4, 'Adrien', 'Baril', 'adrien.baril@gmail.com', '0612345678', 'password', FALSE, 1);

INSERT INTO tblPerson (PK_idPerson, name, surname, mail, telephone_number, password, is_manager, FK_IdColocation)
VALUES (5, 'Louis', 'Bigo', 'louis.bigo@gmail.com', '0612345678', 'password', FALSE, 1);


-- Regular members for second colocation
INSERT INTO tblPerson (PK_idPerson, name, surname, mail, telephone_number, password, is_manager, FK_IdColocation)
VALUES (6, 'Quentin', 'Couturier', 'quentin.couturier@gmail.com', '0612345678', 'password', FALSE, 2);

INSERT INTO tblPerson (PK_idPerson, name, surname, mail, telephone_number, password, is_manager, FK_IdColocation)
VALUES (7, 'Kylian', 'Eury', 'kylian.eury@gmail.com', '0612345678', 'password', FALSE, 2);


-- Regular members for third colocation
INSERT INTO tblPerson (PK_idPerson, name, surname, mail, telephone_number, password, is_manager, FK_IdColocation)
VALUES (8, 'Roxane', 'Fuatoga', 'roxane.fuatoga@gmail.com', '0612345678', 'password', FALSE, 3);

INSERT INTO tblPerson (PK_idPerson, name, surname, mail, telephone_number, password, is_manager, FK_IdColocation)
VALUES (9, 'Illan', 'Gabarra', 'illan.gabarra@gmail.com', '0612345678', 'password', FALSE, 3);


-- Create some sojourns for regular members
INSERT INTO tblSojourn (PK_idSojourn, dateEntry, dateExit, FK_IdPerson, FK_IdColocation)
VALUES (4, '2025-02-01', NULL, 4, 1);

INSERT INTO tblSojourn (PK_idSojourn, dateEntry, dateExit, FK_IdPerson, FK_IdColocation)
VALUES (5, '2025-02-15', NULL, 5, 1);

INSERT INTO tblSojourn (PK_idSojourn, dateEntry, dateExit, FK_IdPerson, FK_IdColocation)
VALUES (6, '2025-03-01', NULL, 6, 2);

INSERT INTO tblSojourn (PK_idSojourn, dateEntry, dateExit, FK_IdPerson, FK_IdColocation)
VALUES (7, '2025-03-15', NULL, 7, 2);

INSERT INTO tblSojourn (PK_idSojourn, dateEntry, dateExit, FK_IdPerson, FK_IdColocation)
VALUES (8, '2025-04-01', NULL, 8, 3);

INSERT INTO tblSojourn (PK_idSojourn, dateEntry, dateExit, FK_IdPerson, FK_IdColocation)
VALUES (9, '2025-04-15', NULL, 9, 3);