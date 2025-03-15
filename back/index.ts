
Bun.serve({
    port: 3000,
    routes: {
        '/login': {
            POST: async req => {
                const { email, password } = await req.json();
                return Response.json({ username: email, password: password });
            }
        }
    }
})