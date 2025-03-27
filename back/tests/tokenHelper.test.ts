import {expect, test, describe} from "bun:test";
import {TokenHelper} from "../helpers/tokenHelper.ts";
import type {BunRequest} from "bun";


describe("TokenHelper Test", () => {
    let token: string;
    test("TokenHelper.createToken", () => {
        token = TokenHelper.createToken(1);
        expect(token).toBeString();
        expect(token).not.toBeEmpty();
        expect(token.length).toBeGreaterThanOrEqual(64);
    })

    test("TokenHelper.checkToken", () => {
        const userId = TokenHelper.checkToken(token);
        expect(userId).toBeNumber();
        expect(userId).toBe(1);
    })

    test("TokenHelper.getUserId", () => {
        const fakeBunReq = new Request("http://localhost:3000", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }) as unknown as BunRequest<"/">;
        const userId = TokenHelper.getUserId(fakeBunReq);
        expect(userId).toBeNumber();
        expect(userId).toBe(1);
    })

    test("TokenHelper.checkToken with fake Token", () => {
        const fakeToken = "MySuperFakeToken";
        const userId = TokenHelper.checkToken(fakeToken);
        expect(userId).toBeNull();
    })
})
