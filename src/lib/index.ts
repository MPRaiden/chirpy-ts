import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

import * as schema from "./db/schema"
import { config } from "../config"

const conn = postgres(config.dbConfig.dbConnectionString)
export const db = drizzle(conn, { schema })
