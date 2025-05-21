import {type BunRequest, sql} from "bun";
import {AuthHelper} from "../helpers/authHelper.ts";
import {UnauthorizedError} from "../errors/UnauthorizedError.ts";
import {SafeDisplayError} from "../errors/SafeDisplayError.ts";
import {CorsResponse} from "../utils.ts";

export default {
    '/transfer/:userId': {
        GET: async (req: BunRequest<"/transfer/:userId">) => {
            const currentUserId = AuthHelper.checkAuth(req);
            const {userId} = req.params;
            const searchParams = new URLSearchParams(new URL(req.url).search);
            if (currentUserId !== Number(userId)) throw new UnauthorizedError("You are not authorized to view this user's transfers");
            const transfers = await getUserTransfers(Number(userId), Number(searchParams.get("limit") || 10), Number(searchParams.get("offset") || 0));
            return CorsResponse.json(transfers);
        },
        POST: async (req: BunRequest<"/transfer/:userId">) => {
            const currentUserId = AuthHelper.checkAuth(req);
            const {userId} = req.params;
            if (currentUserId !== Number(userId)) throw new UnauthorizedError("You are not authorized to make transfers for this user");
            const {amount, recipientEmail} = await req.json();
            if (!amount || !recipientEmail) throw new SafeDisplayError("Missing fields", 400);
            if (amount <= 0) throw new SafeDisplayError("Amount must be greater than 0", 400);
            const recipient = await getUserByEmail(recipientEmail);
            if (!recipient[0]) throw new SafeDisplayError("Recipient not found", 404);
            if (currentUserId === recipient[0].id) throw new SafeDisplayError("You cannot transfer to yourself", 400);
            await createTransfer(currentUserId, recipient[0].id, amount);
            return CorsResponse.json({message: "Transfer created"}, {status: 201});
        }
    }
}

function getUserTransfers(userId: number, limit: number, offset: number) {
    return sql`SELECT transfers.id, transfers.amount, transfers.date, users.firstname, users.name, True as is_sender
               FROM transfers
                        INNER JOIN users ON transfers.receiver_id = users.id
               WHERE sender_id = ${userId}
               UNION ALL
               SELECT transfers.id, transfers.amount, transfers.date, users.firstname, users.name, False as is_sender
               FROM transfers
                        INNER JOIN users ON transfers.sender_id = users.id
               WHERE receiver_id = ${userId}
               ORDER BY date DESC
                   LIMIT ${limit}
               OFFSET ${offset}`;
}

function getUserByEmail(email: string) {
    return sql`SELECT id
               FROM users
               WHERE mail = ${email}`;
}

function createTransfer(currentUserId: number, recipientId: number, amount: number, date: Date = new Date()) {
    return sql`INSERT INTO transfers (sender_id, receiver_id, amount, date)
               VALUES (${currentUserId}, ${recipientId}, ${amount}, ${date.toISOString()})`;
}