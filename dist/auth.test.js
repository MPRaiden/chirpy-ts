"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const auth_1 = require("./auth");
const errors_1 = require("./errors");
function mockReq(authHeader) {
    return {
        get: (name) => (name.toLowerCase() === "authorization" ? authHeader : undefined),
    };
}
process.env.SALT_ROUNDS = "10";
(0, vitest_1.describe)("Password Hashing", () => {
    const password1 = "correctPassword123!";
    const password2 = "anotherPassword456!";
    let hash1;
    let hash2;
    (0, vitest_1.beforeAll)(async () => {
        hash1 = await (0, auth_1.hashPassword)(password1);
        hash2 = await (0, auth_1.hashPassword)(password2);
    });
    (0, vitest_1.it)("should return true for the correct password", async () => {
        const result = await (0, auth_1.checkPasswordHash)(password1, hash1);
        (0, vitest_1.expect)(result).toBe(true);
    });
    (0, vitest_1.it)("should return false for an incorrect password", async () => {
        const result = await (0, auth_1.checkPasswordHash)("wrongPassword", hash1);
        (0, vitest_1.expect)(result).toBe(false);
    });
    (0, vitest_1.it)("should return false when password doesn't match a different hash", async () => {
        const result = await (0, auth_1.checkPasswordHash)(password1, hash2);
        (0, vitest_1.expect)(result).toBe(false);
    });
    (0, vitest_1.it)("should return false for an empty password", async () => {
        const result = await (0, auth_1.checkPasswordHash)("", hash1);
        (0, vitest_1.expect)(result).toBe(false);
    });
    (0, vitest_1.it)("should return false for an invalid hash", async () => {
        const result = await (0, auth_1.checkPasswordHash)(password1, "invalidhash");
        (0, vitest_1.expect)(result).toBe(false);
    });
});
(0, vitest_1.describe)("JWT Functions", () => {
    const secret = "secret";
    const wrongSecret = "wrong_secret";
    const userID = "some-unique-user-id";
    let validToken;
    (0, vitest_1.beforeAll)(() => {
        validToken = (0, auth_1.makeJWT)(userID, 3600, secret);
    });
    (0, vitest_1.it)("should validate a valid token", () => {
        const result = (0, auth_1.validateJWT)(validToken, secret);
        (0, vitest_1.expect)(result).toBe(userID);
    });
    (0, vitest_1.it)("should throw an error for an invalid token string", () => {
        (0, vitest_1.expect)(() => (0, auth_1.validateJWT)("invalid.token.string", secret)).toThrow(errors_1.UnauthorizedRequestError);
    });
    (0, vitest_1.it)("should throw an error when the token is signed with a wrong secret", () => {
        (0, vitest_1.expect)(() => (0, auth_1.validateJWT)(validToken, wrongSecret)).toThrow(errors_1.UnauthorizedRequestError);
    });
    (0, vitest_1.it)("throws UnauthorizedRequestError when Authorization header is missing", () => {
        const req = mockReq(undefined);
        (0, vitest_1.expect)(() => (0, auth_1.getBearerToken)(req)).toThrow(errors_1.UnauthorizedRequestError);
    });
    (0, vitest_1.it)("throws BadRequestError when header lacks Bearer prefix", () => {
        const req = mockReq("Token abc");
        (0, vitest_1.expect)(() => (0, auth_1.getBearerToken)(req)).toThrow(errors_1.BadRequestError);
    });
    (0, vitest_1.it)("returns token when header is valid", () => {
        const req = mockReq("Bearer abc123");
        (0, vitest_1.expect)((0, auth_1.getBearerToken)(req)).toBe("abc123");
    });
});
