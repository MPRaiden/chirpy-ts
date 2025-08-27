import { envOrThrow } from "./helpers";
process.loadEnvFile();
const DB_URL = envOrThrow(process.env.DB_URL);
export const config = {
    fileserverhits: 0,
    dbURL: DB_URL
};
