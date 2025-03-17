import {AuthHelper} from "../helpers/authHelper.ts";

export default {
    '/login': {
        POST: async (req: Request) => {
            return await AuthHelper.login(req);
        }
    }
}