import { envOrThrow } from "./helpers.js";
process.loadEnvFile();
const DB_URL = envOrThrow(process.env.DB_URL);
const PLATFORM = envOrThrow(process.env.PLATFORM);
export const config = {
    fileserverhits: 0,
    dbConfig: {
        dbConnectionString: DB_URL,
        migrationsConfig: {
            migrationsFolder: "src/lib/db/migrations"
        }
    },
    platform: PLATFORM
};
