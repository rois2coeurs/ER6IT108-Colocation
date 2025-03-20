import {AuthHelper} from "../helpers/authHelper.ts";

export default {
    '/login': {
        POST: async (req: Request) => {
            return await AuthHelper.login(req);
        }
    },
    '/validate': {
        GET: async (req: Request) => {
            const userId = AuthHelper.checkAuth(req);
            return Response.json({userId});
        }
    }
}