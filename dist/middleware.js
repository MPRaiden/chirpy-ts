"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.middlewareLogResponses = middlewareLogResponses;
exports.middlewareMetricsInc = middlewareMetricsInc;
// @ts-ignore
const config_1 = require("./config");
function middlewareLogResponses(req, res, next) {
    res.on("finish", () => {
        const status = res.statusCode;
        if (status < 200 || status >= 300) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${status}`);
        }
    });
    next();
}
function middlewareMetricsInc(req, res, next) {
    config_1.config.fileserverhits++;
    next();
}
