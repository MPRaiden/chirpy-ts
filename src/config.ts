import { envOrThrow } from "./helpers"

process.loadEnvFile()

const DB_URL = envOrThrow(process.env.DB_URL)

type APIConfig = {
  fileserverhits: number,
  dbURL: string,
}

export const config: APIConfig = {
  fileserverhits: 0,
  dbURL: DB_URL 
}

