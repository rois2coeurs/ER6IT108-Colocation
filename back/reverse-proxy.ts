const serve = Bun.serve({
    port: 8090,
    async fetch(req) {
        const url = new URL(req.url);
        if (url.hostname !== 'localhost') {
            return new Response('Reverse proxy only works on localhost', {status: 400});
        }
        if (url.pathname.startsWith('/front/')) {
            const file = Bun.file("../" + url.pathname);
            console.log(url + " ==> " + "../" + url.pathname);
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

function getFileType(file: string) {
    const ext = file.split('.').pop();
    if (ext === 'html') return 'text/html';
    if (ext === 'css') return 'text/css';
    if (ext === 'js') return 'text/javascript';
    return 'text/plain';
}