import {type BunRequest, sql} from "bun";
import {AuthHelper} from "../helpers/authHelper.ts";
import {UnauthorizedError} from "../errors/UnauthorizedError.ts";
import {SafeDisplayError} from "../errors/SafeDisplayError.ts";
import {castToNumber, setBounds} from "../utils.ts";

export default {
    '/admin/users': {
        GET: async (req: BunRequest<"/admin/users">) => {
            const userId = AuthHelper.checkAuth(req);
            if (!await isAdmin(userId)) throw new UnauthorizedError("Admin access required");
            
            const searchParams = new URLSearchParams(new URL(req.url).search);
            const limit = castToNumber(searchParams.get('limit'));
            const offset = castToNumber(searchParams.get('offset'));
            
            const users = await getUsers(limit, offset);
            return Response.json(users);
        }
    },
    '/admin/house-shares': {
        GET: async (req: BunRequest<"/admin/house-shares">) => {
            const userId = AuthHelper.checkAuth(req);
            if (!await isAdmin(userId)) throw new UnauthorizedError("Admin access required");
            
            const searchParams = new URLSearchParams(new URL(req.url).search);
            const limit = castToNumber(searchParams.get('limit'));
            const offset = castToNumber(searchParams.get('offset'));
            
            const houseShares = await getHouseShares(limit, offset);
            return Response.json(houseShares);
        }
    },
    '/admin/shared-funds': {
        GET: async (req: BunRequest<"/admin/shared-funds">) => {
            const userId = AuthHelper.checkAuth(req);
            if (!await isAdmin(userId)) throw new UnauthorizedError("Admin access required");
            
            const searchParams = new URLSearchParams(new URL(req.url).search);
            const limit = castToNumber(searchParams.get('limit'));
            const offset = castToNumber(searchParams.get('offset'));
            
            const sharedFunds = await getSharedFunds(limit, offset);
            return Response.json(sharedFunds);
        }
    },
    '/admin/purchases': {
        GET: async (req: BunRequest<"/admin/purchases">) => {
            const userId = AuthHelper.checkAuth(req);
            if (!await isAdmin(userId)) throw new UnauthorizedError("Admin access required");
            
            const searchParams = new URLSearchParams(new URL(req.url).search);
            const limit = castToNumber(searchParams.get('limit'));
            const offset = castToNumber(searchParams.get('offset'));
            
            const purchases = await getPurchases(limit, offset);
            return Response.json(purchases);
        }
    },
    '/admin/transfers': {
        GET: async (req: BunRequest<"/admin/transfers">) => {
            const userId = AuthHelper.checkAuth(req);
            if (!await isAdmin(userId)) throw new UnauthorizedError("Admin access required");
            
            const searchParams = new URLSearchParams(new URL(req.url).search);
            const limit = castToNumber(searchParams.get('limit'));
            const offset = castToNumber(searchParams.get('offset'));
            
            const transfers = await getTransfers(limit, offset);
            return Response.json(transfers);
        }
    },
    '/admin/house-share/:id/manager': {
        GET: async (req: BunRequest<"/admin/house-share/:id/manager">) => {
            const userId = AuthHelper.checkAuth(req);
            if (!await isAdmin(userId)) throw new UnauthorizedError("Admin access required");
            
            const {id} = req.params;
            const manager = await getHouseShareManager(Number(id));
            if (!manager) throw new SafeDisplayError("Manager not found for this house share", 404);
            
            return Response.json(manager);
        }
    }
}

async function isAdmin(userId: number): Promise<boolean> {
    const user = await sql`SELECT is_admin
                           FROM users
                           WHERE id = ${userId}`;
    return user[0]?.is_admin as boolean;
}

async function getUsers(limit: number | null, offset: number | null) {
    limit = setBounds(limit, 1, 100);
    offset ??= 0;
    return sql`SELECT id, name, firstname, mail, phone_number, is_admin
               FROM users
               ORDER BY id
               LIMIT ${limit} OFFSET ${offset}`;
}

async function getHouseShares(limit: number | null, offset: number | null) {
    limit = setBounds(limit, 1, 100);
    offset ??= 0;
    return sql`SELECT id, name, address, manager_id
               FROM house_share
               ORDER BY id
               LIMIT ${limit} OFFSET ${offset}`;
}

async function getSharedFunds(limit: number | null, offset: number | null) {
    limit = setBounds(limit, 1, 100);
    offset ??= 0;
    return sql`SELECT sf.id, sf.amount, sf.house_share_id, hs.name as house_share_name
               FROM shared_fund sf
               JOIN house_share hs ON sf.house_share_id = hs.id
               ORDER BY sf.id
               LIMIT ${limit} OFFSET ${offset}`;
}

async function getPurchases(limit: number | null, offset: number | null) {
    limit = setBounds(limit, 1, 100);
    offset ??= 0;
    return sql`SELECT p.id, p.title, p.amount, p.date, p.user_id, u.firstname, u.name,
                      p.house_share_id, hs.name as house_share_name, 
                      p.shared_fund_id, p.shared_fund_id IS NOT NULL AS shared_fund_set
               FROM purchases p
               JOIN users u ON p.user_id = u.id
               JOIN house_share hs ON p.house_share_id = hs.id
               ORDER BY p.date DESC
               LIMIT ${limit} OFFSET ${offset}`;
}

async function getTransfers(limit: number | null, offset: number | null) {
    limit = setBounds(limit, 1, 100);
    offset ??= 0;
    return sql`SELECT t.id, t.amount, t.date, 
                      t.sender_id, s.firstname as sender_firstname, s.name as sender_name,
                      t.receiver_id, r.firstname as receiver_firstname, r.name as receiver_name
               FROM transfers t
               JOIN users s ON t.sender_id = s.id
               JOIN users r ON t.receiver_id = r.id
               ORDER BY t.date DESC
               LIMIT ${limit} OFFSET ${offset}`;
}

async function getHouseShareManager(houseShareId: number) {
    const manager = await sql`SELECT u.id, u.name, u.firstname, u.mail, u.phone_number, u.is_admin
                             FROM house_share hs
                             JOIN users u ON hs.manager_id = u.id
                             WHERE hs.id = ${houseShareId}`;
    return manager[0];
}