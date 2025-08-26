import express from "express"
import { handlerNumRequests, handlerReadiness, handlerResetNumRequests, handlersError, handlerValidateChirp } from "./handlers.js";
import {middlewareLogResponses, middlewareMetricsInc } from "./middleware.js";

const app = express()
const PORT = 8081

app.use("/app", middlewareMetricsInc)
app.use("/app", express.static("./src/app"))
app.use(express.json())
app.use(middlewareLogResponses)

app.get("/api/healthz", handlerReadiness)
app.post("/api/validate_chirp", handlerValidateChirp)
app.post("/admin/reset", handlerResetNumRequests)
app.get("/admin/metrics", handlerNumRequests)


app.use(handlersError);


const server = app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`)
})


