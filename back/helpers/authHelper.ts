import {sql} from "bun";
import {TokenHelper} from "./tokenHelper.ts";

export class AuthHelper {
    static checkAuth(req: any) {
        const token = req.headers.get('Authorization');
        if (!token) throw new Error('Unauthorized');
        const userId = TokenHelper.checkToken(token.replace('Bearer ', ''));
        if (!userId) throw new Error('Unauthorized');
    }

    static async login(req: any) {
        const {email, password} = await req.json();
        if (!email || !password) return Response.json({error: 'Missing credentials'}, {status: 400});
        const user = await sql`SELECT *
                               FROM users
                               WHERE mail = ${email};`;
        if (!user[0] || !await Bun.password.verify(password, user[0].password)) {
            return Response.json({error: 'Invalid credentials'}, {status: 401});
        }
        return Response.json({token: TokenHelper.createToken(user[0].id)});
    }
}