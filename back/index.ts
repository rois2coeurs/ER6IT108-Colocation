import {AuthHelper} from "./helpers/authHelper.ts";
import {TokenHelper} from "./helpers/tokenHelper.ts";

const tokenHelper = new TokenHelper();

Bun.serve({
    port: 3000,
    routes: {
        '/login': {
            POST: async (req) => {
                return await AuthHelper.login(req, tokenHelper);
            }
        },
        '/health': new Response("OK", {status: 200}),
    },
    error(error) {
        if (error.message === 'Unauthorized') return Response.json({error: 'Unauthorized'}, {status: 401});
        console.error(error);
        return Response.json({error: 'Internal server error'}, {status: 500});
    }
})