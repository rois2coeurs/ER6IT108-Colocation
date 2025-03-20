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