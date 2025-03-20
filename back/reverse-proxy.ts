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
        if (url.pathname.startsWith('/front/')) {
            const file = Bun.file("../" + url.pathname);
            if (!file) return new Response('File not found', {status: 404});
            console.log(url + " ==> " + "../" + url.pathname);
            return new Response(file);
        } else {
            console.log(url + " ==> http://localhost:3000" + url.pathname);
            return fetch(`http://localhost:3000${url.pathname}`, req);
        }
    }
});

console.warn("/!\\ This is a development reverse proxy, do not use it in production. /!\\");
console.log(`Reverse proxy running on ${serve.url}`);