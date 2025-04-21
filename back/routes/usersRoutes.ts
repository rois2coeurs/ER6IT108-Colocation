import {type BunRequest, sql} from "bun";
import {AuthHelper} from "../helpers/authHelper.ts";

export default {
    '/me': {
        GET: async (req: BunRequest<"/me">) => {
            const userId = AuthHelper.checkAuth(req);
            const ids = await getUserRelatedId(userId);
            if (!ids) return Response.json(null);
            return Response.json({houseShareId: ids.house_share_id, sharedFundId: ids.shared_fund_id});
        }
    }
}


async function getUserRelatedId(userId: number) {
    const ids = await sql`SELECT stays.house_share_id, shared_fund.id AS shared_fund_id
                          FROM stays
                                   LEFT JOIN shared_fund ON stays.house_share_id = shared_fund.house_share_id
                          WHERE user_id = ${userId}
                            AND exit_date IS NULL`;
    return ids[0];
}