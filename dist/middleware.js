// @ts-ignore
import { config } from './config.js';
export function middlewareLogResponses(req, res, next) {
    res.on("finish", () => {
        const status = res.statusCode;
        if (status < 200 || status >= 300) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${status}`);
        }
    });
    next();
}
export function middlewareMetricsInc(req, res, next) {
    config.fileserverhits++;
    next();
}
