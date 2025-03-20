import {type BunRequest, sql} from "bun";
import {AuthHelper} from "../helpers/authHelper.ts";

export default {
    '/me/house-share': {
        GET: async (req: BunRequest<"/me/house-share">) => {
            const userId = AuthHelper.checkAuth(req);
            const houseShareId = await getUserHouseShare(userId);
            return Response.json({houseShareId});
        }
    }
}


async function getUserHouseShare(userId: number) {
    const house = await sql`SELECT house_share_id
                            FROM stays
                            WHERE user_id = ${userId}`;
    return house[0].house_share_id;
}