import {AuthHelper} from "../helpers/authHelper.ts";
import {type BunRequest, sql} from "bun";
import {TokenHelper} from "../helpers/tokenHelper.ts";

export default {
    '/login': {
        POST: async (req: BunRequest<"/login">) => {
            const token = await AuthHelper.login(req);
            const userId = TokenHelper.checkToken(token);
            if (userId) {
                const user = await getUserGeneralInfo(userId);
                return Response.json({token, user: user[0]});
            }
            return Response.json({token});
        }
    },
    '/validate': {
        GET: async (req: BunRequest<"/validate">) => {
            const userId = AuthHelper.checkAuth(req);
            return Response.json({userId});
        }
    },
    '/register': {
        POST: async (req: BunRequest<"/register">) => {
            const token = await AuthHelper.register(req);
            const userId = TokenHelper.checkToken(token);
            if (userId) {
                const user = await getUserGeneralInfo(userId);
                return Response.json({token, user: user[0]});
            }
            return Response.json({token});
        }
    }
}

function getUserGeneralInfo(userId: number) {
    return sql`SELECT firstname, name, mail, phone_number
               FROM users
               WHERE id = ${userId}`;
}