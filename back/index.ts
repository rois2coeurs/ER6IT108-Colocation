import authRoutes from "./routes/authRoutes.ts";
import houseShareRoutes from "./routes/houseShareRoutes.ts";

Bun.serve({
    port: 3000,
    routes: {
        ...authRoutes,
        ...houseShareRoutes,
        '/health': new Response("OK", {status: 200}),
    },
    error(error) {
        if (error.message === 'Unauthorized') return Response.json({error: 'Unauthorized'}, {status: 401});
        console.error(error);
        return Response.json({error: 'Internal server error'}, {status: 500});
    }
})