import {type BunRequest, sql} from "bun";
import {TokenHelper} from "./tokenHelper.ts";
import {UnauthorizedError} from "../errors/UnauthorizedError.ts";
import {SafeDisplayError} from "../errors/SafeDisplayError.ts";

export class AuthHelper {
    static checkAuth(req: BunRequest) {
        const token = req.headers.get('Authorization');
        if (!token) throw new UnauthorizedError;
        const userId = TokenHelper.checkToken(token.replace('Bearer ', ''));
        if (!userId) throw new UnauthorizedError;
        return userId;
    }

    static async login(req: BunRequest) {
        const {email, password} = await req.json();
        if (!email || !password) throw new SafeDisplayError("Missing fields", 400);
        const user = await getUserByEmail(email);
        if (!user[0] || !await Bun.password.verify(password, user[0].password)) throw new UnauthorizedError("Invalid credentials");
        return TokenHelper.createToken(user[0].id);
    }

    static async register(req: BunRequest) {
        const {email, first_name, name, password, phone_number} = await req.json();
        if (!email || !first_name || !name || !password || !phone_number) throw new SafeDisplayError("Missing fields", 400);
        if (!checkPassword(password)) throw new SafeDisplayError("Password too weak", 400);
        if (!checkPhoneNumber(phone_number)) throw new SafeDisplayError("Invalid phone number", 400);
        const user = await getUserByEmail(email);
        if (user[0]) throw new SafeDisplayError("User already exists", 400);
        try {
            const new_user = await insertUser(email, first_name, name, password, phone_number);
            return TokenHelper.createToken(new_user[0].id);
        } catch (e) {
            throw new SafeDisplayError("Error while creating user", 500);
        }
    }
}

function checkPassword(password: string) {
    if (password.length < 8) return false;
    return !(!password.match(/[A-Z]/) && !password.match(/[0-9]/));
}

function checkPhoneNumber(phone_number: string) {
    return phone_number.match(/\+?[0-9]{7,15}/);
}

async function getUserByEmail(email: string) {
    return sql`SELECT *
               FROM users
               WHERE mail = ${email};`;
}

async function insertUser(email: string, first_name: string, name: string, password: string, phone_number: string) {
    return sql`INSERT INTO users (mail, firstname, name, password, phone_number)
               VALUES (${email}, ${first_name}, ${name}, ${await Bun.password.hash(password)},
                       ${phone_number})
               RETURNING id;`;
}