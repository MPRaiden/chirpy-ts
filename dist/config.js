"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const helpers_1 = require("./helpers");
process.loadEnvFile();
const DB_URL = (0, helpers_1.envOrThrow)(process.env.DB_URL);
const PLATFORM = (0, helpers_1.envOrThrow)(process.env.PLATFORM);
const JWT_SECRET = (0, helpers_1.envOrThrow)(process.env.JWT_SECRET);
const POLKA_KEY = (0, helpers_1.envOrThrow)(process.env.POLKA_KEY);
exports.config = {
    fileserverhits: 0,
    dbConfig: {
        dbConnectionString: DB_URL,
        migrationsConfig: {
            migrationsFolder: "src/lib/db/migrations"
        }
    },
    platform: PLATFORM,
    jwtSecret: JWT_SECRET,
    polkaKey: POLKA_KEY
};
