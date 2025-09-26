"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.updateUserMailPass = updateUserMailPass;
exports.deleteUsers = deleteUsers;
exports.getUserByEmail = getUserByEmail;
exports.getUserById = getUserById;
exports.updateUserToRed = updateUserToRed;
const index_1 = require("../index");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
async function createUser(user) {
    const [result] = await index_1.db
        .insert(schema_1.users)
        .values(user)
        .onConflictDoNothing()
        .returning();
    return result;
}
async function updateUserMailPass(user, userId) {
    await index_1.db.update(schema_1.users).set({ 'email': user.email, 'hashed_password': user.hashed_password }).where((0, drizzle_orm_1.eq)(schema_1.users.id, userId));
}
async function deleteUsers() {
    await index_1.db.delete(schema_1.users);
}
async function getUserByEmail(email) {
    const [result] = await index_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.email, email));
    return result;
}
async function getUserById(userId) {
    const [result] = await index_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, userId));
    return result;
}
async function updateUserToRed(userId) {
    await index_1.db.update(schema_1.users).set({ 'is_chirpy_red': true }).where((0, drizzle_orm_1.eq)(schema_1.users.id, userId));
}
