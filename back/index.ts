import authRoutes from "./routes/authRoutes.ts";
import houseShareRoutes from "./routes/houseShareRoutes.ts";
import {SafeDisplayError} from "./errors/SafeDisplayError.ts";
import usersRoutes from "./routes/usersRoutes.ts";

Bun.spawn(["bun", "run", "migrator.ts"], {
    stdin: "inherit",
    stdout: "inherit",
    stderr: "inherit",
});

Bun.serve({
    port: 3000,
    routes: {
        ...authRoutes,
        ...houseShareRoutes,
        ...usersRoutes,
        '/health': new Response("OK", {status: 200}),
    },
    error(error: Error) {
        if (error instanceof SafeDisplayError) {
            return Response.json({error: error.message}, {status: error.statusCode});
        }
        console.error(error);
        return Response.json({error: 'Internal server error'}, {status: 500});
    }
})