import {type BunRequest, sql} from "bun";
import {AuthHelper} from "../helpers/authHelper.ts";
import {SafeDisplayError} from "../errors/SafeDisplayError.ts";
import {UnauthorizedError} from "../errors/UnauthorizedError.ts";

export default {
    '/me': {
        GET: async (req: BunRequest<"/me">) => {
            const userId = AuthHelper.checkAuth(req);
            const ids = await getUserRelatedId(userId);
            if (!ids) return Response.json(null);
            return Response.json({houseShareId: ids.house_share_id, sharedFundId: ids.shared_fund_id});
        }
    },
    '/users/:id': {
        PUT: async (req: BunRequest<"/users/:id">) => {
            const currentUserId = AuthHelper.checkAuth(req);
            const {id} = req.params;
            
            if (currentUserId !== Number(id)) throw new UnauthorizedError("You are not authorized to update this user");
            
            const {name, firstname, phone_number, password} = await req.json();
            
            if (!name || !firstname || !phone_number) throw new SafeDisplayError("Missing required fields", 400);
            
            if (!phone_number.match(/^[0-9]{10}$/)) {
                throw new SafeDisplayError("Phone number must be exactly 10 digits", 400);
            }
            
            if (password) {
                if (password.length < 8) throw new SafeDisplayError("Password too weak", 400);
                if (!password.match(/[A-Z]/) && !password.match(/[0-9]/)) throw new SafeDisplayError("Password too weak", 400);
                await updateUserWithPassword(Number(id), name, firstname, phone_number, password);
            } else {
                await updateUserWithoutPassword(Number(id), name, firstname, phone_number);
            }
            
            return Response.json({message: "User updated successfully"});
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

async function updateUserWithPassword(userId: number, name: string, firstname: string, phone_number: string, password: string) {
    return sql`UPDATE users 
               SET name = ${name}, 
                   firstname = ${firstname}, 
                   phone_number = ${phone_number}, 
                   password = ${await Bun.password.hash(password)}
               WHERE id = ${userId}`;
}

async function updateUserWithoutPassword(userId: number, name: string, firstname: string, phone_number: string) {
    return sql`UPDATE users 
               SET name = ${name}, 
                   firstname = ${firstname}, 
                   phone_number = ${phone_number}
               WHERE id = ${userId}`;
}