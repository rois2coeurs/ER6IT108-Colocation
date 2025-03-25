import {type BunRequest, sql} from "bun";
import {AuthHelper} from "../helpers/authHelper.ts";
import {SafeDisplayError} from "../errors/SafeDisplayError.ts";
import {UnauthorizedError} from "../errors/UnauthorizedError.ts";

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

            return Response.json(res[0], {status: 201});
        }
    },
    '/house-share/:id': {
        GET: async (req: BunRequest<"/house-share/:id">) => {
            AuthHelper.checkAuth(req);
            const {id} = req.params;
            const house = await getHouseShare(Number(id));
            if (!house[0]) throw new SafeDisplayError("house-share not found!", 404);
            return Response.json(house[0]);
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
    '/house-share/:id/members' : {
        GET: async (req: BunRequest<"/house-share/:id/members">) => {
            AuthHelper.checkAuth(req);
            const {id} = req.params;
            const members = await getHouseShareMembers(Number(id));
            return Response.json(members);
        },
        POST: async (req: BunRequest<"/house-share/:id/members">) => {
            const userId = AuthHelper.checkAuth(req);
            const {id} = req.params;
            await addHouseShareMember(Number(userId), Number(id));

            const {email} = await req.json();
            if (!email) throw new SafeDisplayError("Missing email", 400);

            const user = await sql`SELECT id FROM users WHERE email = ${email};`;
            if (!user[0]) throw new SafeDisplayError("User not found", 404);

            await addHouseShareMember(Number(user), Number(id));

            return Response.json({message: "User added to house-share"}, {status: 201});
        },
        PUT: async (req: BunRequest<"/house-share/:id/members/:memberId">) => {
            const userId = AuthHelper.checkAuth(req);
            const {id} = req.params;

            await updateHouseShareMember(Number(userId), Number(id));

            return Response.json({message: "User added to house-share"}, {status: 201});
        }
    }
}

async function getAllHouseShares() {
    return sql`SELECT *
               FROM house_share;`;
}

async function getHouseShare(id: number) {
    return sql`SELECT *
               FROM house_share
               WHERE id = ${id};`;
}

async function newHouseShare(name: string, address: string, userId: number) {
    return sql`INSERT INTO house_share (name, address, manager_id)
               VALUES (${name}, ${address}, ${userId})
               RETURNING id;`;
}

async function deleteHouseShare(id: string) {
    await sql`DELETE
              FROM house_share
              WHERE id = ${id};`;
}

async function updateHouseShare(name: string, address: string, id: number) {
    await sql`UPDATE house_share
              SET name    = ${name},
                  address = ${address}
                  WHERE id = ${id};`;
}

async function getHouseShareMembers(id: number) {
    return sql`SELECT users.user_id, users.name, users.firstname, users.entry_date, users.exit_date
            FROM stays
            INNER JOIN users ON user_id = users.id
            WHERE house_share_id = ${id};`;
}

async function addHouseShareMember(userId: number, id: number) {
    await sql`INSERT INTO stays (entry_date, user_id, house_share_id)
                VALUES (${new Date().toLocaleString()},${userId},${id});`;
}

async function updateHouseShareMember(userId: number, id: number) {
    await sql`UPDATE stays 
            SET exit_date = ${new Date().toLocaleString()}
            WHERE house_share_id = ${id} AND user_id = ${userId} AND exit_date IS NULL;`; 
}