import express from "express";
import { handlerNumRequests, handlerReadiness, handlerResetNumRequests, handlerValidateChirp } from "./handlers.js";
import { middlewareLogResponses, middlewareMetricsInc } from "./middleware.js";
const app = express();
const PORT = 8080;
app.use("/app", middlewareMetricsInc);
app.use("/app", express.static("./src/app"));
app.use(middlewareLogResponses);
app.get("/api/healthz", handlerReadiness);
app.post("/api/validate_chirp", handlerValidateChirp);
app.post("/admin/reset", handlerResetNumRequests);
app.get("/admin/metrics", handlerNumRequests);
const server = app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`);
});
