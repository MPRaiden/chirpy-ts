"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const auth_1 = require("./auth");
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
});
