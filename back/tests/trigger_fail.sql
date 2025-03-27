SELECT *
FROM stays;

INSERT INTO stays (entry_date, exit_date, user_id, house_share_id)
VALUES ('2021-01-01', '2021-01-31', 1, 1);

-- This should fail
INSERT INTO stays (entry_date, exit_date, user_id, house_share_id)
VALUES ('2021-01-08', '2021-01-27', 1, 1);

-- This should fail
INSERT INTO stays (entry_date, exit_date, user_id, house_share_id)
VALUES ('2021-01-08', '2026-01-27', 1, 2);

-- This should fail
INSERT INTO stays (entry_date, exit_date, user_id, house_share_id)
VALUES ('2025-01-08', '2026-01-27', 1, 2);

