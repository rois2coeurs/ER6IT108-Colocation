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
        }
    },
    '/house-share/:id': {
        GET: async (req: BunRequest<"/house-share/:id">) => {
            AuthHelper.checkAuth(req);
            const {id} = req.params;
            const house = await getHouseShare(Number(id));
            if (!house[0]) throw new SafeDisplayError("house-share not found!", 404);
            return Response.json(house[0]);
        }
    },
    '/house-share/:id/members' : {
        GET: async (req: BunRequest<"/house-share/:id/members">) => {
            AuthHelper.checkAuth(req);
            const {id} = req.params;
            const members = await getHouseShareMembers(Number(id));
            return Response.json(members);
        }
    },
    '/house-share/:id/shared-fund' : {
        GET: async (req: BunRequest<"/house-share/:id/shared-fund">) => {
            AuthHelper.checkAuth(req);
            const {id} = req.params;
            const members = await getHouseShareSharedFund(Number(id));
            return Response.json(members);
        }
    },
    '/house-share/:id/shared-fund/payments' : {
        GET: async (req: BunRequest<"/house-share/:id/shared-fund/payments">) => {
            AuthHelper.checkAuth(req);
            const {id} = req.params;
            const members = await getHouseShareSharedFundPayments(Number(id));
            return Response.json(members);
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

async function getHouseShareMembers(id: number) {
    return sql`SELECT users.id, users.name, users.firstname, users.mail, users.phone_number, 
                      stays.entry_date, stays.exit_date
            FROM stays
            INNER JOIN users ON stays.user_id = users.id
            WHERE stays.house_share_id = ${id};`;
}

async function getHouseShareSharedFund(id: number) {
    return sql`SELECT name
               FROM house_share
               WHERE id = ${id};`;
}

async function getHouseShareSharedFundPayments(id: number) {
    return sql`
        SELECT users.name, users.firstname, contributions.date, contributions.amount
        FROM house_share
        INNER JOIN shared_fund ON shared_fund.house_share_id = house_share.id
        INNER JOIN contributions ON contributions.shared_fund_id = shared_fund.id
        INNER JOIN users ON contributions.user_id = users.id
        WHERE house_share.id = ${id}
        ORDER BY contributions.date DESC;`;
}