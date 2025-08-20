import express from "express"
import { handlerNumRequests, handlerReadiness, handlerResetNumRequests } from "./handlers.js";
import { middlewareLogResponses, middlewareMetricsInc } from "./middleware.js";

const app = express()
const PORT = 8080

app.use("/app", middlewareMetricsInc)
app.use("/app", express.static("./src/app"))

app.use(middlewareLogResponses)

app.get("/healthz", handlerReadiness)
app.get("/metrics", handlerNumRequests)
app.get("/reset", handlerResetNumRequests)


const server = app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`)
})


