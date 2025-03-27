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
        const fakeToken = "13286fe57ab62fb2bc5ded6e208624e814d2a44e8a78f3c9674647e1e5cfba81";
        const userId = TokenHelper.checkToken(fakeToken);
        expect(userId).toBeNull();
    })
})
