import {type BunRequest, sql} from "bun";
import {AuthHelper} from "../helpers/authHelper.ts";
import {SafeDisplayError} from "../errors/SafeDisplayError.ts";

export default {
    '/invites/:id': {
        PUT: async (req: BunRequest<'/invites/:id'>) => {
            const userId = AuthHelper.checkAuth(req);
            const {id} = req.params;

            const {status} = await req.json();
            if (status !== "accepted" && status !== "declined" && status !== "cancelled") throw new SafeDisplayError("Invalid status", 400);
            const invite = await getInvite(Number(id));
            if (invite.status !== "pending") throw new SafeDisplayError("Invite already used", 400);
            if (status === "cancelled") {
                if (!await canCancelInvite(Number(id), userId)) throw new SafeDisplayError("Only the manager can cancel an invite", 403);
                await updateInviteStatus(Number(id), "cancelled");
                return Response.json({message: "Invite cancelled",});
            }
            if (status === "accepted") {
                if (await isUserStayingSomewhere(userId)) throw new SafeDisplayError("You are already staying somewhere", 400);
                await createNewStay(userId, invite.house_share_id);
                await updateInviteStatus(Number(id), "accepted");
                return Response.json({message: "Invite accepted", houseShareId: invite.house_share_id});
            }
            if (status === "declined") {
                await updateInviteStatus(Number(id), "declined");
                return Response.json({message: "Invite declined",});
            }
        }
    },
    '/invites': {
        GET: async (req: BunRequest<'/invites'>) => {
            const userId = AuthHelper.checkAuth(req);
            const invites = await sql`SELECT invites.*, hs.name, hs.address
                                      FROM invites
                                               INNER JOIN public.house_share hs on hs.id = invites.house_share_id
                                      WHERE invites.user_id = ${userId}`;
            return Response.json(invites);
        }
    }
}


async function getInvite(id: number) {
    const invite = await sql`SELECT *
                             FROM invites
                             WHERE id = ${id}`;
    if (invite.length === 0) throw new SafeDisplayError("Invite not found", 404);
    return invite[0];
}

async function canCancelInvite(id: number, userId: number) {
    const query = await sql`SELECT 1
                            FROM invites
                                     INNER JOIN public.house_share hs on hs.id = invites.house_share_id
                            WHERE invites.id = ${id}
                              AND manager_id = ${userId}`;
    if (query.length === 0) throw new SafeDisplayError("Only the manager can cancel an invite", 403);
    return true;
}

async function updateInviteStatus(id: number, status: string) {
    return sql`UPDATE invites SET status =
    ${status}
    WHERE
    id
    =
    ${id}`;
}

async function isUserStayingSomewhere(userId: number) {
    const query = await sql`SELECT 1
                            FROM stays
                            WHERE user_id = ${userId}
                              AND exit_date IS NULL`;
    return query.length !== 0;
}

async function createNewStay(userId: number, houseShareId: number) {
    return sql`INSERT INTO stays (user_id, house_share_id, entry_date)
                            VALUES (
    ${userId},
    ${houseShareId},
    NOW()
    )`;
}