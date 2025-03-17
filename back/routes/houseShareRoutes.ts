import {type BunRequest, sql} from "bun";
import {AuthHelper} from "../helpers/authHelper.ts";
import {TokenHelper} from "../helpers/tokenHelper.ts";

export default {
    '/house-share': {
        GET: async (req: BunRequest<"/house-share">) => {
            AuthHelper.checkAuth(req);
            const houses = await getAllHouseShares();
            return Response.json(houses);
        },
        POST: async (req: BunRequest<"/house-share">) => {
            AuthHelper.checkAuth(req);

            const {name, address} = await req.json();
            if (!name || !address) return new Response("Missing fields", {status: 400});

            const userId = TokenHelper.getUserId(req);
            if (!userId) return new Response("Unauthorized", {status: 401});

            await sql`INSERT INTO house_share (name, address, manager_id)
                      VALUES (${name}, ${address}, ${userId});`;

            return new Response("House-share created", {status: 201});
        }
    },
    '/house-share/:id': {
        GET: async (req: BunRequest<"/house-share/:id">) => {
            AuthHelper.checkAuth(req);
            const {id} = req.params;
            const house = await getHouseShare(Number(id));
            if (!house[0]) return new Response("house-share not found!", {status: 404});
            return Response.json(house[0]);
        },
        DELETE: async (req: BunRequest<"/house-share/:id">) => {
            AuthHelper.checkAuth(req);
            const {id} = req.params;
            const userId = TokenHelper.getUserId(req);
            if (!userId) return new Response("Unauthorized", {status: 401});

            const house = await getHouseShare(Number(id));
            if (!house[0]) return new Response("house-share not found!", {status: 404});
            if (house[0].manager_id !== userId) return new Response("Unauthorized", {status: 401});

            await sql`DELETE FROM house_share
                      WHERE id = ${id};`;

            return new Response("House-share deleted", {status: 200});
        },
        PUT: async (req: BunRequest<"/house-share/:id">) => {
            AuthHelper.checkAuth(req);
            const {id} = req.params;
            const userId = TokenHelper.getUserId(req);
            if (!userId) return new Response("Unauthorized", {status: 401});

            const house = await getHouseShare(Number(id));
            if (!house[0]) return new Response("house-share not found!", {status: 404});
            if (house[0].manager_id !== userId) return new Response("Unauthorized", {status: 401});

            const {name, address} = await req.json();
            if (!name || !address) return new Response("Missing fields", {status: 400});

            await sql`UPDATE house_share
                      SET name = ${name}, address = ${address}
                      WHERE id = ${id};`;

            return new Response("House-share updated", {status: 200});
        }
    }
}

function getAllHouseShares() {
    return sql`SELECT *
               FROM house_share;`;
}

function getHouseShare(id: number) {
    return sql`SELECT *
               FROM house_share
               WHERE id = ${id};`;
}