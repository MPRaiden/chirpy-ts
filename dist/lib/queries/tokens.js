"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertRefreshToken = insertRefreshToken;
exports.getRefreshTokenByValue = getRefreshTokenByValue;
exports.getUserByRefreshToken = getUserByRefreshToken;
exports.revokeToken = revokeToken;
const index_1 = require("../index");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
async function insertRefreshToken(token) {
    const [result] = await index_1.db
        .insert(schema_1.refreshTokens)
        .values(token)
        .onConflictDoNothing()
        .returning();
    return result;
}
async function getRefreshTokenByValue(token) {
    const [result] = await index_1.db.select().from(schema_1.refreshTokens).where((0, drizzle_orm_1.eq)(schema_1.refreshTokens.token, token));
    return result;
}
async function getUserByRefreshToken(token) {
    const [result] = await index_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, token.userId));
    return result;
}
async function revokeToken(token) {
    const now = new Date();
    await index_1.db.update(schema_1.refreshTokens).set({ 'revokedAt': now, 'updatedAt': now }).where((0, drizzle_orm_1.eq)(schema_1.refreshTokens.token, token.token));
}
