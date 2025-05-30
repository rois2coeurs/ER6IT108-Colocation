import {randomBytes} from 'node:crypto';
const TOKEN_MAX_AGE = 1000 * 60 * 60 * 8; // 8 hours

let tokens: Array<Token> = [];

export class TokenHelper {
    static createToken(userId: number) {
        const userToken = tokens.find(t => t.getUserId() === userId);
        if (userToken) tokens = tokens.filter(t => t.getToken() !== userToken.getToken());

        const token = randomBytes(32).toString('hex');
        tokens.push(new Token(token, userId));
        setTimeout(() => {
            tokens = tokens.filter(t => t.getToken() !== token);
        }, TOKEN_MAX_AGE);
        return token;
    }

    static checkToken(token: string) {
        const tokenObject = tokens.find(t => t.getToken() === token);
        if (!tokenObject) return null;
        return tokenObject.getUserId();
    }

    static getUserId(req: Request): number | null {
        const authorization = req.headers.get('Authorization');
        const token = authorization?.replace('Bearer ', '');
        return TokenHelper.checkToken(token || '');
    }
}


class Token {
    private readonly token: string;
    private readonly userId: number;

    constructor(token: string, userId: number) {
        this.token = token;
        this.userId = userId;
    }

    getUserId() {
        return this.userId;
    }

    getToken() {
        return this.token;
    }
}