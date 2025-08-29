"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createChirp = createChirp;
const index_1 = require("../index");
const schema_1 = require("../db/schema");
async function createChirp(chirp) {
    const [result] = await index_1.db.insert(schema_1.chirps).values(chirp).onConflictDoNothing().returning();
    return result;
}
