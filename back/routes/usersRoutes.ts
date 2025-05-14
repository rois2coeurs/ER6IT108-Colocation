import {type BunRequest, sql} from "bun";
import {AuthHelper} from "../helpers/authHelper.ts";
import {SafeDisplayError} from "../errors/SafeDisplayError.ts";
import {UnauthorizedError} from "../errors/UnauthorizedError.ts";
import {checkPhoneNumber} from "../utils.ts";
import {checkPassword} from "../utils.ts";

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
            
            const {firstname, name, phone_number, password} = await req.json();
            
            if (!firstname || !name || !phone_number) throw new SafeDisplayError("Missing required fields", 400);
            
            if (!checkPhoneNumber(phone_number)) {
                throw new SafeDisplayError("Phone number must only have digits and the length between 7 and 15 digits", 400);
            }
            
            if (password) {
                if(!checkPassword(password)) throw new SafeDisplayError("Password too weak", 400);
                await updateUserWithPassword(Number(id), firstname, name, phone_number, password);
            } else {
                await updateUserWithoutPassword(Number(id), firstname, name, phone_number);
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