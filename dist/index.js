"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const postgres_1 = __importDefault(require("postgres"));
const migrator_1 = require("drizzle-orm/postgres-js/migrator");
const handlers_1 = require("./handlers");
const middleware_1 = require("./middleware");
const postgres_js_1 = require("drizzle-orm/postgres-js");
const config_1 = require("./config");
const handlers_users_1 = require("./handlers-users");
const handlers_chirps_1 = require("./handlers-chirps");
(async () => {
    const migrationClient = (0, postgres_1.default)(config_1.config.dbConfig.dbConnectionString, { max: 1 });
    await (0, migrator_1.migrate)((0, postgres_js_1.drizzle)(migrationClient), config_1.config.dbConfig.migrationsConfig);
    const app = (0, express_1.default)();
    const PORT = 8081;
    app.use("/app", middleware_1.middlewareMetricsInc);
    app.use("/app", express_1.default.static("./src/app"));
    app.use(express_1.default.json());
    app.use(middleware_1.middlewareLogResponses);
    app.get("/api/healthz", handlers_1.handlerReadiness);
    app.post("/api/chirps", handlers_chirps_1.handlersCreateChirp);
    app.get("/api/chirps", handlers_chirps_1.handlersGetChirps);
    app.get("/api/chirps/:chirpID", handlers_chirps_1.handlersGetChirp);
    app.post("/api/users", handlers_users_1.handlersCreateUser);
    app.post("/api/login/", handlers_users_1.handlersLogin);
    app.post("/api/refresh/", handlers_users_1.handlerRefreshToken);
    app.post("/api/revoke/", handlers_users_1.handlerRevokeRefreshToken);
    app.put("/api/users/", handlers_users_1.handlerUsersUpdate);
    app.delete("/api/chirps/:chirpID", handlers_chirps_1.handlersDeleteChirp);
    app.post("/api/polka/webhooks", handlers_users_1.handlersUsersUpgrade);
    app.post("/admin/reset", handlers_users_1.handlersDeleteUsers);
    app.get("/admin/metrics", handlers_1.handlerNumRequests);
    app.use(handlers_1.handlersError);
    const server = app.listen(PORT, () => {
        console.log(`server listening on port ${PORT}`);
    });
})().catch((err) => {
    console.error(err);
    process.exit(1);
});
