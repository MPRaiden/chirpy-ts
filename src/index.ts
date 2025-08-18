import express from "express"
import { handlerReadiness } from "./handlers.js";
import { middlewareLogResponses } from "./middleware.js";

const app = express()
const PORT = 8080

app.use("/app", express.static("./src/app"))
app.use(middlewareLogResponses)

app.get("/healthz", handlerReadiness)


const server = app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`)
})


