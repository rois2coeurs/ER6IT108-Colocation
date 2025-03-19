import {sql} from "bun";
import {TokenHelper} from "./tokenHelper.ts";
import {UnauthorizedError} from "../errors/UnauthorizedError.ts";
import {SafeDisplayError} from "../errors/SafeDisplayError.ts";

export class AuthHelper {
    static checkAuth(req: any) {
        const token = req.headers.get('Authorization');
        if (!token) throw new UnauthorizedError;
        const userId = TokenHelper.checkToken(token.replace('Bearer ', ''));
        if (!userId) throw new UnauthorizedError;
        return userId;
    }

    static async login(req: any) {
        const {email, password} = await req.json();
        if (!email || !password) throw new SafeDisplayError("Missing fields", 400);
        const user = await sql`SELECT *
                               FROM users
                               WHERE mail = ${email};`;
        if (!user[0] || !await Bun.password.verify(password, user[0].password)) throw new UnauthorizedError("Invalid credentials");
        return Response.json({token: TokenHelper.createToken(user[0].id)});
    }
}