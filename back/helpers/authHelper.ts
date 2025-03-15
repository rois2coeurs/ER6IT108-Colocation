import {sql} from "bun";
import type {TokenHelper} from "./tokenHelper.ts";

export class AuthHelper {
    static checkAuth(req: any, tokenHelper: TokenHelper) {
        const token = req.headers.get('Authorization');
        if (!token) throw new Error('Unauthorized');
        const userId = tokenHelper.checkToken(token.replace('Bearer ', ''));
        if (!userId) throw new Error('Unauthorized');
    }

    static async login(req: any, tokenHelper: TokenHelper) {
        const {email, password} = await req.json();
        if (!email || !password) return Response.json({error: 'Missing credentials'}, {status: 400});
        const user = await sql`SELECT *
                               FROM users
                               WHERE mail = ${email};`;
        if (!user[0] || !await Bun.password.verify(password, user[0].password)) {
            return Response.json({error: 'Invalid credentials'}, {status: 401});
        }
        return Response.json({token: tokenHelper.createToken(user[0].id)});
    }
}