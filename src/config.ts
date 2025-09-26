import { envOrThrow } from "./helpers"
import {MigrationConfig} from "drizzle-orm/migrator"

process.loadEnvFile()

const DB_URL = envOrThrow(process.env.DB_URL)
const PLATFORM = envOrThrow(process.env.PLATFORM)
const JWT_SECRET = envOrThrow(process.env.JWT_SECRET)
const POLKA_KEY = envOrThrow(process.env.POLKA_KEY)

type APIConfig = {
  fileserverhits: number,
  dbConfig: DBConfig,
  platform: string,
  jwtSecret: string,
  polkaKey: string,
}

type DBConfig = {
  dbConnectionString: string,
  migrationsConfig: MigrationConfig
}

export const config: APIConfig = {
  fileserverhits: 0,
  dbConfig: {
    dbConnectionString: DB_URL, 
    migrationsConfig: {
      migrationsFolder:"src/lib/db/migrations"
    }
  },
  platform: PLATFORM,
  jwtSecret: JWT_SECRET,
  polkaKey: POLKA_KEY
}

