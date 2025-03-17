import {randomUUIDv7} from "bun";
const TOKEN_MAX_AGE = 1000 * 60 * 60 * 12; // 12 hours

export class TokenHelper {
    private tokens: Array<Token> = [];

    createToken(userId: number) {
        const userToken = this.tokens.find(t => t.getUserId() === userId);
        if (userToken) this.tokens = this.tokens.filter(t => t.getToken() !== userToken.getToken());

        const token = randomUUIDv7();
        this.tokens.push(new Token(token, userId));
        setTimeout(() => {
            this.tokens = this.tokens.filter(t => t.getToken() !== token);
        }, TOKEN_MAX_AGE);
        return token;
    }

    checkToken(token: string) {
        const tokenObject = this.tokens.find(t => t.getToken() === token);
        if (!tokenObject) return null;
        return tokenObject.getUserId();
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