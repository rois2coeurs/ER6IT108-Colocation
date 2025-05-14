import {type BunRequest, sql} from "bun";
import {AuthHelper} from "../helpers/authHelper.ts";
import {UnauthorizedError} from "../errors/UnauthorizedError.ts";
import {castToNumber, setBounds} from "../utils.ts";
import {SafeDisplayError} from "../errors/SafeDisplayError.ts";

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
        },
        POST: async (req: BunRequest<"/purchase">) => {
            const currentUserId = AuthHelper.checkAuth(req);
            const {title, amount, date, useShareFund} = await req.json();
            const amountNum = Number(amount);
            const dateObj = new Date(date);
            if (isNaN(amountNum) || isNaN(dateObj.getTime())) {
                throw new SafeDisplayError("Invalid amount or date format", 400);
            }
            await createPurchase(currentUserId, title, amountNum, dateObj, useShareFund === "on");
            return Response.json({success: true});
        }
    }
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
    const totalCount = await sql`SELECT COUNT(0) AS total_count
                                 FROM purchases ${userIdCondition}`;
    return {
        purchases,
        total: totalCount[0]?.total_count ?? 0
    };
}

async function getUseShareFund(userId: number): Promise<number | null> {
    const sharedFund = await sql`SELECT shared_fund.id
                                 FROM shared_fund
                                          INNER JOIN public.house_share hs on shared_fund.house_share_id = hs.id
                                          INNER JOIN public.stays s on hs.id = s.house_share_id
                                 WHERE s.user_id = ${userId}
                                   AND s.exit_date IS NULL;`;
    return sharedFund[0]?.id ?? null;
}

async function createPurchase(userId: number, title: string, amount: number, date: Date, useShareFund: boolean) {
    if (!title || !amount || !date) throw new Error("Missing required fields");
    if (amount <= 0) throw new Error("Amount must be greater than 0");
    const houseShareId = await getUserHouseShareId(userId);
    if (!houseShareId) throw new Error("You don't have a house share");
    if (useShareFund) {
        const sharedFundId = await getUseShareFund(userId);
        if (!sharedFundId) throw new Error("You don't have a shared fund");
        await sql`INSERT INTO purchases (user_id, title, amount, date, house_share_id, shared_fund_id)
              VALUES (${userId}, ${title}, ${amount}, ${date.toISOString()}, ${houseShareId}, ${sharedFundId})`;
    } else {
        await sql`INSERT INTO purchases (user_id, title, amount, date, house_share_id)
              VALUES (${userId}, ${title}, ${amount}, ${date.toISOString()}, ${houseShareId})`;
    }
}

async function getUserHouseShareId(userId: number): Promise<number | null> {
    const houseShare = await sql`SELECT house_share.id
                                 FROM house_share
                                          INNER JOIN public.stays s on house_share.id = s.house_share_id
                                 WHERE s.user_id = ${userId}
                                   AND s.exit_date IS NULL;`;
    return houseShare[0]?.id ?? null;
}