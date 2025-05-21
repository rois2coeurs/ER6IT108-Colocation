import {AuthHelper} from "../helpers/authHelper.ts";
import {type BunRequest, sql} from "bun";
import {TokenHelper} from "../helpers/tokenHelper.ts";
import {CorsResponse} from "../utils.ts";

export default {
    '/login': {
        POST: async (req: BunRequest<"/login">) => {
            const token = await AuthHelper.login(req);
            const userId = TokenHelper.checkToken(token);
            if (userId) {
                const user = await getUserGeneralInfo(userId);
                return CorsResponse.json({token, user: user[0]});
            }
            return CorsResponse.json({token});
        }
    },
    '/validate': {
        GET: async (req: BunRequest<"/validate">) => {
            const userId = AuthHelper.checkAuth(req);
            return CorsResponse.json({userId});
        }
    },
    '/register': {
        POST: async (req: BunRequest<"/register">) => {
            const token = await AuthHelper.register(req);
            const userId = TokenHelper.checkToken(token);
            if (userId) {
                const user = await getUserGeneralInfo(userId);
                return CorsResponse.json({token, user: user[0]});
            }
            return CorsResponse.json({token});
        }
    }
}

function getUserGeneralInfo(userId: number) {
    return sql`SELECT id, firstname, name, mail, phone_number
               FROM users
               WHERE id = ${userId}`;
}