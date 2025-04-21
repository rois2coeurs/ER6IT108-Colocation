import {type BunRequest, sql} from "bun";
import {AuthHelper} from "../helpers/authHelper.ts";
import {UnauthorizedError} from "../errors/UnauthorizedError.ts";
import {castToNumber, setBounds} from "../utils.ts";

export default {
    '/purchase': {
        GET: async (req: BunRequest<"/purchase">) => {
            const currentUserId = AuthHelper.checkAuth(req);
            const searchParams = new URLSearchParams(new URL(req.url).search);
            const userId = castToNumber(searchParams.get('userId'));
            if (userId && (userId !== currentUserId || !await isAdmin(currentUserId))) throw new UnauthorizedError("You are not authorized to view this user's purchases");
            const limit = castToNumber(searchParams.get('limit'));
            const offset = castToNumber(searchParams.get('offset'));
            return Response.json(await getPurchases(userId, 5, offset));
        }
    }
}

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function isAdmin(userId: number): Promise<boolean> {
    const user = await sql`SELECT is_admin
                           FROM users
                           WHERE id = ${userId}`;
    return user[0]?.is_admin as boolean;
}

async function getPurchases(userId: number | null, limit: number | null, offset: number | null) {
    const userIdCondition = userId ? sql`WHERE user_id =
    ${userId}` : sql``;
    limit = setBounds(limit, 1, 100);
    offset ??= 0;
    const purchases = await sql`SELECT purchases.id,
                                       purchases.title,
                                       purchases.amount,
                                       purchases.date,
                                       purchases.shared_fund_id IS NOT NULL AS shared_fund_set,
                                       house_share.name                     AS house_share_name,
                                       house_share.id                       AS house_share_id
                                FROM purchases
                                         LEFT JOIN house_share ON purchases.house_share_id = house_share.id
                                    ${userIdCondition}
                                ORDER BY purchases.date DESC
                                LIMIT ${limit} OFFSET ${offset} `;
    const totalCount = await sql`SELECT COUNT(0) AS total_count FROM purchases ${userIdCondition}`;
    return {
        purchases,
        total: totalCount[0]?.total_count ?? 0
    };
}