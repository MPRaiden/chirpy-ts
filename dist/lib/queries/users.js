"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.deleteUsers = deleteUsers;
const index_1 = require("../index");
const schema_1 = require("../db/schema");
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
