"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createChirp = createChirp;
exports.getChirps = getChirps;
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
