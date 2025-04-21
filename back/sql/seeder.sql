-- Admin users

INSERT INTO users (firstname, name, mail, phone_number, password, is_admin)
VALUES ('Nicolas', 'Thongphao', 'nicolas.thongphao@gmail.com', '0612345678',
        '$argon2id$v=19$m=65536,t=2,p=1$MeSKv0lICDInUP/5Ckc6iDV+NqmjN9eesxdd0iaqbIc$mQZAxinzMvMRZ0eBcpdJRuDW0VKwiyRFwpjzfgr30zE',
        TRUE),
       ('Valentin', 'Raillard', 'valentin.raillard@coloc.com', '0612345678',
        '$argon2id$v=19$m=65536,t=2,p=1$MeSKv0lICDInUP/5Ckc6iDV+NqmjN9eesxdd0iaqbIc$mQZAxinzMvMRZ0eBcpdJRuDW0VKwiyRFwpjzfgr30zE',
        TRUE),
       ('Admin', 'Test', 'admin.test@gmail.com', '0678901234',
        '$argon2id$v=19$m=65536,t=2,p=1$MeSKv0lICDInUP/5Ckc6iDV+NqmjN9eesxdd0iaqbIc$mQZAxinzMvMRZ0eBcpdJRuDW0VKwiyRFwpjzfgr30zE',
        TRUE);

-- Regular members for first colocation
INSERT INTO users (firstname, name, mail, phone_number, password)
VALUES ('Adrien', 'Baril', 'adrien.baril@gmail.com', '0612345678',
        '$argon2id$v=19$m=65536,t=2,p=1$MeSKv0lICDInUP/5Ckc6iDV+NqmjN9eesxdd0iaqbIc$mQZAxinzMvMRZ0eBcpdJRuDW0VKwiyRFwpjzfgr30zE'),
       ('Louis', 'Bigo', 'louis.bigo@gmail.com', '0612345678',
        '$argon2id$v=19$m=65536,t=2,p=1$MeSKv0lICDInUP/5Ckc6iDV+NqmjN9eesxdd0iaqbIc$mQZAxinzMvMRZ0eBcpdJRuDW0VKwiyRFwpjzfgr30zE'),
-- Regular members for second colocation
       ('Quentin', 'Couturier', 'quentin.couturier@gmail.com', '0612345678',
        '$argon2id$v=19$m=65536,t=2,p=1$MeSKv0lICDInUP/5Ckc6iDV+NqmjN9eesxdd0iaqbIc$mQZAxinzMvMRZ0eBcpdJRuDW0VKwiyRFwpjzfgr30zE'),
       ('Kylian', 'Eury', 'kylian.eury@gmail.com', '0612345678',
        '$argon2id$v=19$m=65536,t=2,p=1$MeSKv0lICDInUP/5Ckc6iDV+NqmjN9eesxdd0iaqbIc$mQZAxinzMvMRZ0eBcpdJRuDW0VKwiyRFwpjzfgr30zE'),
-- Regular members for third colocation
       ('Roxane', 'Fuatoga', 'roxane.fuatoga@gmail.com', '0612345678',
        '$argon2id$v=19$m=65536,t=2,p=1$MeSKv0lICDInUP/5Ckc6iDV+NqmjN9eesxdd0iaqbIc$mQZAxinzMvMRZ0eBcpdJRuDW0VKwiyRFwpjzfgr30zE'),
       ('Illan', 'Gabarra', 'illan.gabarra@gmail.com', '0612345678',
        '$argon2id$v=19$m=65536,t=2,p=1$MeSKv0lICDInUP/5Ckc6iDV+NqmjN9eesxdd0iaqbIc$mQZAxinzMvMRZ0eBcpdJRuDW0VKwiyRFwpjzfgr30zE');

-- Insert colocations
INSERT INTO house_share (name, address, manager_id)
VALUES ('Coloc des Amis', '123 Rue du Bonheur, Paris, 75001', 1),
       ('La Maison Bleue', '45 Avenue des Fleurs, Lyon, 69001', 2),
       ('Appart Sympa', '78 Boulevard du Soleil, Marseille, 13001', 3);


-- Create pots (cagnottes) for each colocation
INSERT INTO shared_fund (amount, house_share_id)
VALUES (0.00, 1),
       (0.00, 2),
       (0.00, 3);


-- Sojourns for the first members/who are the administrators of the colocations
INSERT INTO stays (entry_date, exit_date, user_id, house_share_id)
VALUES ('2025-01-01', NULL, 1, 1),
       ('2025-01-01', NULL, 2, 2),
       ('2025-01-01', NULL, 3, 3);


-- A little Abundance from the first administrator
INSERT INTO contributions (user_id, shared_fund_id, date, amount)
VALUES (1, 1, '2025-01-02', 10.00);

-- A little Payment (Versement) from the first administrator too
INSERT INTO transfers (sender_id, receiver_id, date, amount)
VALUES (1, 2, '2025-01-03', 5.00);

-- A little Achat from the first administrator too
INSERT INTO purchases (title, amount, date, shared_fund_id, user_id)
VALUES ('Crousty', 15.00, '2025-01-04', 1, 1),
       ('Tacos', 8.50, '2025-01-04', 2, 2),
       ('Salade', 6.75, '2025-01-05', 2, 2),
       ('Pizza', 18.90, '2025-01-06', 2, 2),
       ('Sushi', 25.00, '2025-01-07', 2, 2),
       ('Burger', 12.00, '2025-01-08', 2, 2),
       ('Pâtes', 14.30, '2025-01-09', 2, 2),
       ('Sandwich', 5.50, '2025-01-10', null, 2),
       ('Glace', 7.20, '2025-01-11', null, 2),
       ('Boisson', 3.00, '2025-01-12', null, 2),
       ('Chips', 2.50, '2025-01-13', null, 2),
       ('Chocolat', 4.00, '2025-01-14', null, 2),
       ('Bonbons', 3.75, '2025-01-15', null, 2),
       ('Café', 2.00, '2025-01-16', null, 2),
       ('Thé', 1.80, '2025-01-17', null, 2),
       ('Croissant', 1.50, '2025-01-18', null, 2),
       ('Pain', 1.20, '2025-01-19', null, 2),
       ('Fromage', 6.00, '2025-01-20', null, 2),
       ('Jus d''orange', 3.50, '2025-01-21', null, 2),
       ('Lait', 1.00, '2025-01-22', null, 2),
       ('Céréales', 4.50, '2025-01-23', null, 2),
       ('Yaourt', 2.30, '2025-01-24', null, 2),
       ('Poulet', 10.00, '2025-01-25', null, 2),
       ('Poisson', 12.50, '2025-01-26', null, 2),
       ('Riz', 3.00, '2025-01-27', null, 2),
       ('Pâtes fraîches', 5.00, '2025-01-28', null, 2),
       ('Vin', 15.00, '2025-01-29', null, 2),
       ('Bière', 2.50, '2025-01-30', null, 2),
       ('Eau', 1.00, '2025-01-31', null, 2),
       ('Fruits', 7.00, '2025-02-01', null, 2),
       ('Légumes', 8.00, '2025-02-02', null, 2),
       ('Pizza surgelée', 6.50, '2025-02-03', null, 2),
       ('Gâteau', 10.00, '2025-02-04', null, 2);
-- Create some sojourns for regular members
INSERT INTO stays (entry_date, exit_date, user_id, house_share_id)
VALUES ('2025-02-01', NULL, (SELECT id from users where mail = 'adrien.baril@gmail.com'), 1),
       ('2025-02-15', NULL, (SELECT id from users where mail = 'louis.bigo@gmail.com'), 1),
       ('2025-03-01', NULL, (SELECT id from users where mail = 'quentin.couturier@gmail.com'), 2),
       ('2025-03-15', NULL, (SELECT id from users where mail = 'kylian.eury@gmail.com'), 2),
       ('2025-04-01', NULL, (SELECT id from users where mail = 'roxane.fuatoga@gmail.com'), 3),
       ('2025-04-15', NULL, (SELECT id from users where mail = 'illan.gabarra@gmail.com'), 3);