-- Admin users
INSERT INTO users (firstname, name, mail, phone_number, password, is_admin)
VALUES ('Nicolas', 'Thongphao', 'nicolas.thongphao@gmail.com', '0612345678', 'password', TRUE),
       ('Valentin', 'Raillard', 'valentin.raillard@coloc.com', '0612345678', 'password', TRUE),
       ('Admin', 'Test', 'admin.test@gmail.com', '0678901234', 'password', TRUE);

-- Regular members for first colocation
INSERT INTO users (firstname, name, mail, phone_number, password)
VALUES ('Adrien', 'Baril', 'adrien.baril@gmail.com', '0612345678', 'password'),
       ('Louis', 'Bigo', 'louis.bigo@gmail.com', '0612345678', 'password'),
-- Regular members for second colocation
       ('Quentin', 'Couturier', 'quentin.couturier@gmail.com', '0612345678', 'password'),
       ('Kylian', 'Eury', 'kylian.eury@gmail.com', '0612345678', 'password'),
-- Regular members for third colocation
       ('Roxane', 'Fuatoga', 'roxane.fuatoga@gmail.com', '0612345678', 'password'),
       ('Illan', 'Gabarra', 'illan.gabarra@gmail.com', '0612345678', 'password');

-- Create some sojourns for regular members
INSERT INTO stays (entry_date, exit_date, user_id, house_share_id)
VALUES ('2025-02-01', NULL, (SELECT id from users where mail = 'adrien.baril@gmail.com'), 1),
       ('2025-02-15', NULL, (SELECT id from users where mail = 'louis.bigo@gmail.com'), 1),
       ('2025-03-01', NULL, (SELECT id from users where mail = 'quentin.couturier@gmail.com'), 2),
       ('2025-03-15', NULL, (SELECT id from users where mail = 'kylian.eury@gmail.com'), 2),
       ('2025-04-01', NULL, (SELECT id from users where mail = 'roxane.fuatoga@gmail.com'), 3),
       ('2025-04-15', NULL, (SELECT id from users where mail = 'illan.gabarra@gmail.com'), 3);