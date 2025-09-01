"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.deleteUsers = deleteUsers;
exports.getUserByEmail = getUserByEmail;
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
async function deleteUsers() {
    await index_1.db.delete(schema_1.users);
}
async function getUserByEmail(email) {
    const [result] = await index_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.email, email));
    return result;
}
