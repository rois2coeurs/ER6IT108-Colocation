import {type BunRequest, sql} from "bun";
import {AuthHelper} from "../helpers/authHelper.ts";
import {SafeDisplayError} from "../errors/SafeDisplayError.ts";
import {UnauthorizedError} from "../errors/UnauthorizedError.ts";
import {castToNumber, setBounds} from "../utils.ts";

export default {
    '/house-share': {
        GET: async (req: BunRequest<"/house-share">) => {
            AuthHelper.checkAuth(req);
            const houses = await getAllHouseShares();
            return Response.json(houses);
        },
        POST: async (req: BunRequest<"/house-share">) => {
            const userId = AuthHelper.checkAuth(req);

            const {name, address} = await req.json();
            if (!name || !address) throw new SafeDisplayError("Missing fields", 400);

            const res = await newHouseShare(name, address, userId);
            await addHouseShareMember(userId, res[0].id);

            return Response.json(res[0], {status: 201});
        }
    },
    '/house-share/:id': {
        GET: async (req: BunRequest<"/house-share/:id">) => {
            const userId = AuthHelper.checkAuth(req);
            const {id} = req.params;
            if (!await isMember(userId, Number(id))) throw new SafeDisplayError("You are not a member of this house-share", 400);
            const house = await getHouseShare(Number(id));
            if (!house[0]) throw new SafeDisplayError("house-share not found!", 404);
            return Response.json(house[0], {headers: {'Cache-Control': 'max-age=300'}});
        },
        DELETE: async (req: BunRequest<"/house-share/:id">) => {
            const userId = AuthHelper.checkAuth(req);
            const {id} = req.params;

            const house = await getHouseShare(Number(id));
            if (!house[0]) throw new SafeDisplayError("house-share not found!", 404);
            if (house[0].manager_id !== userId) throw new UnauthorizedError();
            await deleteHouseShare(id);

            return new Response("House-share deleted", {status: 200});
        },
        PUT: async (req: BunRequest<"/house-share/:id">) => {
            const userId = AuthHelper.checkAuth(req);
            const {id} = req.params;

            const house = await getHouseShare(Number(id));
            if (!house[0]) throw new SafeDisplayError("house-share not found!", 404);
            if (house[0].manager_id !== userId) throw new UnauthorizedError();

            const {name, address} = await req.json();
            if (!name || !address) throw new SafeDisplayError("Missing fields", 400);

            await updateHouseShare(name, address, Number(id));

            return Response.json({message: "House-share updated"}, {status: 200});
        }
    },
    '/house-share/:id/members': {
        GET: async (req: BunRequest<"/house-share/:id/members">) => {
            const userId = AuthHelper.checkAuth(req);
            const {id} = req.params;
            if (!await isMember(userId, Number(id))) throw new SafeDisplayError("You are not a member of this house-share", 400);
            const searchParams = new URLSearchParams(new URL(req.url).search);
            const members = await getHouseShareMembers(Number(id), searchParams.get("active") === "true");
            return Response.json(members);
        },
        POST: async (req: BunRequest<"/house-share/:id/members">) => {
            const userId = AuthHelper.checkAuth(req);
            const {id} = req.params;
            const house = await getHouseShare(Number(id));

            if (!house[0]) throw new SafeDisplayError("house-share not found!", 404);
            if (house[0].manager_id !== userId) throw new UnauthorizedError("Only the manager can add members");
            const {email} = await req.json();

            if (!email) throw new SafeDisplayError("Missing email field", 400);
            const user = await getUserByEmail(email);
            if (!user[0]) throw new SafeDisplayError("User not found", 404);
            await addHouseShareMember(user[0].id, Number(id));

            return Response.json({message: "User added to house-share"}, {status: 201});
        },
        PUT: async (req: BunRequest<"/house-share/:id/members">) => {
            const userId = AuthHelper.checkAuth(req);
            const {id} = req.params;
            const house = await getHouseShare(Number(id));

            if (!house[0]) throw new SafeDisplayError("house-share not found!", 404);
            const membership = await checkMembership(userId, Number(id));
            if (!membership[0]) throw new SafeDisplayError("You are not a member of this house-share", 400);
            if (house[0].manager_id === userId) {
                const members = await getHouseShareMembers(Number(id), true);
                if (members.length > 1) throw new SafeDisplayError("You cannot leave the house-share while being the manager if there are still members", 400);
                await removeHouseShareManager(Number(id));
            }
            await updateHouseShareMember(userId, Number(id));

            return Response.json({message: "Successfully left the house-share"}, {status: 200});
        }
    },
    '/house-share/:id/members/:memberId': {
        PUT: async (req: BunRequest<"/house-share/:id/members/:memberId">) => {
            const userId = AuthHelper.checkAuth(req);
            const {id, memberId} = req.params;
            if (userId === Number(memberId)) throw new SafeDisplayError("You cannot kick yourself", 400);
            const house = await getHouseShare(Number(id));
            if (!house[0]) throw new SafeDisplayError("house-share not found!", 404);
            if (house[0].manager_id !== userId) throw new UnauthorizedError("Only the manager can kick members");

            const membership = await checkMembership(Number(memberId), Number(id));
            if (!membership[0]) throw new SafeDisplayError("This user is not a member of this house-share", 400);
            await updateHouseShareMember(Number(memberId), Number(id));

            return Response.json({message: "Successfully kicked the user from the house-share"}, {status: 200});
        }
    },
    '/house-share/:id/members/:memberId/transfer': {
        PUT: async (req: BunRequest<"/house-share/:id/members/:memberId/transfer">) => {
            const userId = AuthHelper.checkAuth(req);
            const {id, memberId} = req.params;
            const house = await getHouseShare(Number(id));
            if (!house[0]) throw new SafeDisplayError("house-share not found!", 404);
            if (house[0].manager_id !== userId) throw new UnauthorizedError("Only the manager can transfer ownership");

            const membership = await checkMembership(Number(memberId), Number(id));
            if (!membership[0]) throw new SafeDisplayError("This user is not a member of this house-share", 400);
            await updateHouseShareManager(Number(id), Number(memberId));

            return Response.json({message: "Successfully transferred ownership"}, {status: 200});
        }
    },
    '/house-share/:id/purchases': {
    GET: async (req: BunRequest<"/house-share/:id/purchases">) => {
        const currentUserId = AuthHelper.checkAuth(req);
        const searchParams = new URLSearchParams(new URL(req.url).search);
        const {id} = req.params;
        const membership = await checkMembership(Number(currentUserId), Number(id));
        if (!membership || !await isAdmin(currentUserId)) throw new UnauthorizedError("You are not authorized to view this user's purchases");
        const limit = castToNumber(searchParams.get('limit'));
        const offset = castToNumber(searchParams.get('offset'));
        const purchases = await getPurchases(Number(id), limit, offset);
        return Response.json(purchases);
        }
    }
}

async function isAdmin(userId: number): Promise<boolean> {
    const user = await sql`SELECT is_admin
                           FROM users
                           WHERE id = ${userId}`;
    return user[0]?.is_admin as boolean;
}

async function getAllHouseShares() {
    return sql`SELECT *
               FROM house_share;`;
}

async function getHouseShare(id: number) {
    return sql`SELECT house_share.*, shared_fund.id as shared_fund_id
               FROM house_share
               LEFT JOIN shared_fund ON house_share.id = shared_fund.house_share_id
               WHERE house_share.id = ${id};`;
}

async function newHouseShare(name: string, address: string, userId: number) {
    return sql`INSERT INTO house_share (name, address, manager_id)
               VALUES (
    ${name},
    ${address},
    ${userId}
    )
    RETURNING
    id;`;
}

async function deleteHouseShare(id: string) {
    await sql`DELETE
              FROM house_share
              WHERE id =
    ${id};`;
}

async function updateHouseShare(name: string, address: string, id: number) {
    await sql`UPDATE house_share
              SET name    =
    ${name},
    address
    =
    ${address}
    WHERE
    id
    =
    ${id};`;
}

async function removeHouseShareManager(id: number) {
    await sql`UPDATE house_share
              SET manager_id =
    NULL
    WHERE
    id
    =
    ${id};`;
}

async function updateHouseShareManager(id: number, userId: number) {
    await sql`UPDATE house_share
              SET manager_id =
    ${userId}
    WHERE
    id
    =
    ${id};`;
}

async function getHouseShareMembers(id: number, active: boolean) {
    const condition = active ? sql`AND exit_date IS NULL` : sql`AND exit_date IS NOT NULL`;
    return sql`SELECT users.id,
                      users.name,
                      users.firstname,
                      users.mail,
                      users.phone_number,
                      stays.entry_date,
                      stays.exit_date
               FROM stays
                        INNER JOIN users ON stays.user_id = users.id
               WHERE stays.house_share_id = ${id} ${condition}`;
}

async function getUserByEmail(email: string) {
    return sql`SELECT *
               FROM users
               WHERE mail = ${email};`;
}

async function checkMembership(userId: number, houseId: number) {
    return sql`SELECT *
               FROM stays
               WHERE user_id = ${userId}
                 AND house_share_id = ${houseId}
                 AND exit_date IS NULL
               LIMIT 1;`;
}

async function addHouseShareMember(userId: number, id: number) {
    await sql`INSERT INTO stays (entry_date, user_id, house_share_id)
                VALUES (CURRENT_DATE,
    ${userId},
    ${id}
    );`;
}

async function updateHouseShareMember(userId: number, id: number) {
    await sql`UPDATE stays 
            SET exit_date = CURRENT_DATE
            WHERE house_share_id =
    ${id}
    AND
    user_id
    =
    ${userId}
    AND
    exit_date
    IS
    NULL;`;
}

async function isMember(userId: number, houseId: number) {
    const membership = await sql`SELECT id
                                 FROM stays
                                 WHERE user_id = ${userId}
                                   AND house_share_id = ${houseId}
                                   AND exit_date IS NULL
                                 LIMIT 1;`;
    return membership[0] !== undefined;
}

async function getHouseSharePurchases(id: number) {
    return sql`SELECT purchases.id, purchases.title, purchases.amount, purchases.date, 
                      users.firstname, users.name
               FROM purchases
               INNER JOIN users ON purchases.user_id = users.id
               INNER JOIN shared_fund ON purchases.shared_fund_id = shared_fund.id
               WHERE shared_fund.house_share_id = ${id}
               ORDER BY purchases.date DESC;`;
}

async function getPurchases(houseShareId: number | null, limit: number | null, offset: number | null) {
    limit = setBounds(limit, 1, 100);
    offset ??= 0;
    const purchases = await sql`SELECT purchases.id,
                                       purchases.title,
                                       purchases.amount,
                                       purchases.date,
                                       purchases.shared_fund_id IS NOT NULL AS shared_fund_set,
                                       users.firstname,
                                       users.name
                                FROM purchases
                                         LEFT JOIN users ON purchases.user_id = users.id
                                WHERE purchases.house_share_id = ${houseShareId}
                                ORDER BY purchases.date DESC, purchases.id DESC
                                LIMIT ${limit} OFFSET ${offset} `;
    const totalCount = await sql`SELECT COUNT(0) AS total_count
                                 FROM purchases WHERE house_share_id = ${houseShareId}`;
    return {
        purchases,
        total: totalCount[0]?.total_count ?? 0
    };
}