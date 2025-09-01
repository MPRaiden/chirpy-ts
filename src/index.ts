import express from "express"
import postgres from "postgres"
import { migrate } from "drizzle-orm/postgres-js/migrator"

import { handlerNumRequests, handlerReadiness, handlersError } from "./handlers"
import { middlewareLogResponses, middlewareMetricsInc } from "./middleware"
import { drizzle } from "drizzle-orm/postgres-js"
import { config } from "./config"
import { handlersCreateUser, handlersDeleteUsers } from "./handlers-users"
import { handlersCreateChirp, handlersGetChirp, handlersGetChirps } from "./handlers-chirps"

(async() => {
  const migrationClient = postgres(config.dbConfig.dbConnectionString, { max: 1 })
  await migrate(drizzle(migrationClient), config.dbConfig.migrationsConfig)

  const app = express()
  const PORT = 8081

  app.use("/app", middlewareMetricsInc)
  app.use("/app", express.static("./src/app"))
  app.use(express.json())
  app.use(middlewareLogResponses)

  app.get("/api/healthz", handlerReadiness)
  app.post("/api/chirps", handlersCreateChirp)
  app.get("/api/chirps", handlersGetChirps)
  app.get("/api/chirps/:chirpID", handlersGetChirp)
  app.post("/api/users", handlersCreateUser)

  app.post("/admin/reset", handlersDeleteUsers)
  app.get("/admin/metrics", handlerNumRequests)


  app.use(handlersError)


  const server = app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`)
  })

})().catch((err) => {
  console.error(err)
  process.exit(1)
})

