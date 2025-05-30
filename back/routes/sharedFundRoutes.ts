import {type BunRequest, postgres, sql} from "bun";
import {AuthHelper} from "../helpers/authHelper.ts";
import {UnauthorizedError} from "../errors/UnauthorizedError.ts";
import {SafeDisplayError} from "../errors/SafeDisplayError.ts";
import {castToNumber, CorsResponse, setBounds} from "../utils.ts";

export default {
    '/shared-fund': {
        POST: async (req: BunRequest<"/shared-fund">) => {
            const userId = AuthHelper.checkAuth(req);
            const {houseShareId} = await req.json();
            if (!houseShareId) throw new SafeDisplayError("Missing House share ID", 400);
            if (Number(houseShareId) <= 0 || isNaN(Number(houseShareId))) throw new SafeDisplayError("House share ID is not valid", 400);
            if (!await isHouseShareManager(userId, Number(houseShareId))) throw new UnauthorizedError("You are not the manager of this house share");
            if (await existsSharedFund(Number(houseShareId))) throw new SafeDisplayError("Shared fund already exists", 400);
            const sharedFundId = await createSharedFund(Number(houseShareId));
            return CorsResponse.json({message: "Shared fund created successfully", id: sharedFundId});
        }
    },
    '/shared-fund/:id': {
        GET: async (req: BunRequest<"/shared-fund/:id">) => {
            const userId = AuthHelper.checkAuth(req);
            const {id} = req.params;

            if (!await canAccessSharedFund(userId, Number(id)))
                throw new UnauthorizedError("You don't have access to this shared fund");

            const sharedFund = await getSharedFund(Number(id));
            if (!sharedFund[0]) throw new SafeDisplayError("Shared fund not found", 404);

            return CorsResponse.json(sharedFund[0]);
        }
    },
    '/shared-fund/:id/contributions': {
        GET: async (req: BunRequest<"/shared-fund/:id/contributions">) => {
            const userId = AuthHelper.checkAuth(req);
            const {id} = req.params;

            if (!await canAccessSharedFund(userId, Number(id)))
                throw new UnauthorizedError("You don't have access to this shared fund");

            const searchParams = new URLSearchParams(new URL(req.url).search);
            const limit = castToNumber(searchParams.get('limit')) ?? 5;
            const offset = castToNumber(searchParams.get('offset')) ?? 0;

            const contributions = await getContributions(Number(id), limit, offset);
            return CorsResponse.json(contributions);
        },
        POST: async (req: BunRequest<"/shared-fund/:id/contributions">) => {
            const userId = AuthHelper.checkAuth(req);
            const {id} = req.params;

            if (!await canAccessSharedFund(userId, Number(id)))
                throw new UnauthorizedError("You don't have access to this shared fund");

            const {amount} = await req.json();
            if (!amount) throw new SafeDisplayError("Missing amount field", 400);
            if (Number(amount) <= 0) throw new SafeDisplayError("Amount must be greater than 0", 400);

            await addContribution(userId, Number(id), Number(amount));

            return CorsResponse.json({message: "Contribution added successfully"});
        }
    }
}

async function canAccessSharedFund(userId: number, sharedFundId: number) {
    const result = await sql`
        SELECT 1
        FROM stays s
                 JOIN shared_fund sf ON s.house_share_id = sf.house_share_id
        WHERE s.user_id = ${userId}
          AND sf.id = ${sharedFundId}
          AND s.exit_date IS NULL
    `;
    return result.count > 0;
}

async function getSharedFund(id: number) {
    return sql`
        SELECT sf.id, sf.amount, sf.house_share_id, hs.name as house_share_name
        FROM shared_fund sf
                 JOIN house_share hs ON sf.house_share_id = hs.id
        WHERE sf.id = ${id}
    `;
}

async function getContributions(sharedFundId: number, limit: number, offset: number) {
    limit = setBounds(limit, 1, 100);
    offset = setBounds(offset, 0, Number.MAX_SAFE_INTEGER);

    return sql`
        SELECT c.id, c.amount, c.date, u.firstname, u.name
        FROM contributions c
                 JOIN users u ON c.user_id = u.id
        WHERE c.shared_fund_id = ${sharedFundId}
        ORDER BY c.date DESC
        LIMIT
        ${limit}
        OFFSET ${offset}
    `;
}

async function addContribution(userId: number, sharedFundId: number, amount: number) {
    return sql`
        INSERT INTO contributions (user_id, shared_fund_id, date, amount)
        VALUES (
        ${userId},
        ${sharedFundId},
        CURRENT_DATE,
        ${amount}
        )
    `;
}

async function updateSharedFundAmount(sharedFundId: number, amount: number) {
    return sql`
        UPDATE shared_fund
        SET amount = amount +
        ${amount}
        WHERE
        id
        =
        ${sharedFundId}
    `;
}

async function existsSharedFund(houseShareId: number) {
    const result = await sql`
        SELECT 1
        FROM shared_fund
        WHERE house_share_id = ${houseShareId}
    `;
    return result.count > 0;
}

async function isHouseShareManager(userId: number, houseShareId: number) {
    const result = await sql`
        SELECT 1
        FROM house_share
        WHERE id = ${houseShareId}
          AND manager_id = ${userId}
    `;
    return result.count > 0;
}

async function createSharedFund(houseShareId: number) {
    const query = await sql`
        INSERT INTO shared_fund (house_share_id)
        VALUES (${houseShareId})
        RETURNING id
    `;
    if (!query[0]) throw new SafeDisplayError("Failed to create shared fund", 500);
    return query[0].id;
}