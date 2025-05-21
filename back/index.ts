import authRoutes from "./routes/authRoutes.ts";
import houseShareRoutes from "./routes/houseShareRoutes.ts";
import usersRoutes from "./routes/usersRoutes.ts";
import transferRoutes from "./routes/transferRoutes.ts";
import purchaseRoutes from "./routes/purchaseRoutes.ts";
import sharedFundRoutes from "./routes/sharedFundRoutes.ts";
import invitesRoutes from "./routes/invitesRoutes.ts";
import {SafeDisplayError} from "./errors/SafeDisplayError.ts";
import {CorsResponse} from "./utils.ts";

Bun.spawn(["bun", "run", "migrator.ts"], {
    stdin: "inherit",
    stdout: "inherit",
    stderr: "inherit",
});

Bun.serve({
    development: undefined,
    port: 3000,
    fetch(req) {
        if (req.method === 'OPTIONS') return new CorsResponse(null, {status: 204});
    },
    routes: {
        ...authRoutes,
        ...houseShareRoutes,
        ...usersRoutes,
        ...transferRoutes,
        ...purchaseRoutes,
        ...sharedFundRoutes,
        ...invitesRoutes,
        '/health': new CorsResponse("OK", {status: 201}),
    },
    error(error: Error) {
        if (error instanceof SafeDisplayError) {
            return CorsResponse.json({error: error.message}, {status: error.statusCode});
        }
        console.error(error);
        return CorsResponse.json({error: 'Internal server error'}, {status: 500});
    }
})

process.on("SIGINT", () => {
    console.log("SIGINT received, shutting down...");
    process.exit();
})

process.on("SIGTERM", () => {
    console.log("SIGTERM received, shutting down...");
    process.exit();
})