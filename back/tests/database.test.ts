import {expect, test, describe} from "bun:test";
import {SQL} from "bun";

const db = new SQL({
    url: process.env.POSTGRES_TEST_URL
});

describe("Database", () => {
    test("Migration and seeding", async () => {
        const proc = Bun.spawn(["bun", "run", "migrator.ts", "--test", "--seed"]);
        const res = await proc.exited;
        expect(res).toBe(0);
    }, 30000); // timeout of 30 seconds

    test("Inserting an stay for 2021-01-01 -> 2021-01-31", async () => {
        const insert = await db`
            INSERT INTO stays (entry_date, exit_date, user_id, house_share_id)
            VALUES ('2021-01-01', '2021-01-31', 1, 1)
            RETURNING *;
        `;

        const res = await db`
            SELECT *
            FROM stays
            WHERE id = ${insert[0].id};
        `

        expect(res.count).toBe(1);
        expect(res[0].id).toBe(insert[0].id);
    });

    test("Error while inserting a stay for 2021-01-02 -> 2021-01-30", async () => {
        try {
            const insert = await db`
                INSERT INTO stays (entry_date, exit_date, user_id, house_share_id)
                VALUES ('2021-01-02', '2021-01-30', 1, 1)
                RETURNING *;
            `;
            expect(insert.count).toBe(0);
        } catch (e: any) {
            expect(e.message).toBe("A stay already exists for this period or user is already staying somewhere else");
        }
    });

    test("Error while inserting a stay for 2021-01-08 -> 2026-01-27", async () => {
        try {
            const insert = await db`
                INSERT INTO stays (entry_date, exit_date, user_id, house_share_id)
                VALUES ('2021-01-08', '2026-01-27', 1, 2)
                RETURNING *;
            `;
            expect(insert.count).toBe(0);
        } catch (e: any) {
            expect(e.message).toBe("A stay already exists for this period or user is already staying somewhere else");
        }
    });

    test("Error while inserting a stay for 2025-01-08 -> 2026-01-27", async () => {
        try {
            const insert = await db`
                INSERT INTO stays (entry_date, exit_date, user_id, house_share_id)
                VALUES ('2025-01-08', '2026-01-27', 1, 2)
                RETURNING *;
            `;
            expect(insert.count).toBe(0);
        } catch (e: any) {
            expect(e.message).toBe("A stay already exists for this period or user is already staying somewhere else");
        }
    });

    test("Error while inserting a stay for 2025-01-08 -> null", async () => {
        try {
            const insert = await db`
                INSERT INTO stays (entry_date, user_id, house_share_id)
                VALUES ('2025-01-08', 1, 2)
                RETURNING *;
            `;
            expect(insert.count).toBe(0);
        } catch (e: any) {
            expect(e.message).toBe("A stay already exists for this period or user is already staying somewhere else");
        }
    });

    test("Deletion", async () => {
        const proc = Bun.spawn(["bun", "run", "migrator.ts", "--test", "--delete"]);
        const res = await proc.exited;
        expect(res).toBe(0);
    }, 30000); // timeout of 30 seconds
});