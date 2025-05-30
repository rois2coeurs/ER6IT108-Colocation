import type {SpawnOptions} from "bun"

const spawnOptions: SpawnOptions.OptionsObject = {
    stdin: "inherit",
    stdout: "inherit",
    stderr: "inherit",
}

const run = async () => {
    Bun.spawn(["bun", "run", "--watch", "index.ts"], spawnOptions)

    process.on("SIGINT", async () => {
        console.log("Stopping...");
        process.exit()
    })
}

run().then(() => {
    console.log("Backend is up and ready.")
});

const serve = Bun.serve({
    port: 8090,
    async fetch(req) {
        const url = new URL(req.url);
        if (req.method === "OPTIONS") {
            const res = new Response(null);
            setCorsHeaders(res);
            return res;
        }
        const redirectUrl = new URL(req.url);
        redirectUrl.hostname = "localhost";
        redirectUrl.port = "3000";
        redirectUrl.protocol = "http";
        console.log(url + " ==> " + redirectUrl);
        const res = await fetch(redirectUrl, req);
        setCorsHeaders(res);
        return res;
    }
});

function setCorsHeaders(res: Response) {
    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

console.warn("/!\\ This is a development reverse proxy, do not use it in production. /!\\");
console.log(`Reverse proxy running on ${serve.url}`);