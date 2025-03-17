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


-- A little Abundance from the first admiunistrator
INSERT INTO contributions (user_id, shared_fund_id, date, amount)
VALUES (1, 1, '2025-01-02', 10.00);

-- A little Payment (Versement) from the first admiunistrator too
INSERT INTO transfers (sender_id, receiver_id, date, amount)
VALUES ( 1, 2, '2025-01-03', 5.00);

-- A little Achat from the first admiunistrator too
INSERT INTO purchases (title, amount, date, shared_fund_id, user_id)
VALUES ('Crousty', 15.00, '2025-01-04', 1, 1);