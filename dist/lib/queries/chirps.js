"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createChirp = createChirp;
exports.getChirps = getChirps;
exports.getChirpById = getChirpById;
exports.deleteChirp = deleteChirp;
const index_1 = require("../index");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
async function createChirp(chirp) {
    const [result] = await index_1.db.insert(schema_1.chirps).values(chirp).onConflictDoNothing().returning();
    return result;
}
async function getChirps() {
    const result = await index_1.db.select().from(schema_1.chirps).orderBy((0, drizzle_orm_1.asc)(schema_1.chirps.createdAt));
    return result;
}
async function getChirpById(chirpId) {
    const [result] = await index_1.db.select().from(schema_1.chirps).where((0, drizzle_orm_1.eq)(schema_1.chirps.id, chirpId));
    return result;
}
async function deleteChirp(chirpID) {
    await index_1.db.delete(schema_1.chirps).where((0, drizzle_orm_1.eq)(schema_1.chirps.id, chirpID));
}
