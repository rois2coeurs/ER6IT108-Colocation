import type { SpawnOptions } from "bun"

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

run()

const serve = Bun.serve({
    port: 8090,
    async fetch(req) {
        const url = new URL(req.url);
        if (url.hostname !== 'localhost') {
            return new Response('Reverse proxy only works on localhost', {status: 400});
        }
        if (url.pathname.startsWith('/front/')) {
            const file = Bun.file("../" + url.pathname);
            if (!file) return new Response('File not found', {status: 404});
            console.log(url + " ==> " + "../" + url.pathname);
            if (file.name?.endsWith('.png')) {
                return new Response(await file.arrayBuffer(), {
                    headers: {
                        'Content-Type': getFileType(file.name || '')
                    }
                });
            }
            return new Response(await file.text(), {
                headers: {
                    'Content-Type': getFileType(file.name || '')
                }
            });
        } else {
            console.log(url + " ==> http://localhost:3000" + url.pathname);
            return fetch(`http://localhost:3000${url.pathname}`, req);
        }
    }
});

console.log(`Reverse proxy running on ${serve.url}`);

function getFileType(file: string) {
    const ext = file.split('.').pop();
    if (ext === 'html') return 'text/html';
    if (ext === 'css') return 'text/css';
    if (ext === 'js') return 'text/javascript';
    if (ext === 'json') return 'application/json';
    if (ext === 'png') return 'image/png';
    return 'text/plain';
}