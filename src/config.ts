import { envOrThrow } from "./helpers.js"
import {MigrationConfig} from "drizzle-orm/migrator"

process.loadEnvFile()

const DB_URL = envOrThrow(process.env.DB_URL)
const PLATFORM = envOrThrow(process.env.PLATFORM)

type APIConfig = {
  fileserverhits: number,
  dbConfig: DBConfig,
  platform: string,
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
  platform: PLATFORM
}

