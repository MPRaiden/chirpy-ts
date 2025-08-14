import express from "express"
import { handlerReadiness } from "./handlers.js";

const app = express()
const PORT = 8080

app.use("/app", express.static("./src/app"))

app.get("/healthz", handlerReadiness)

const server = app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`)
})


