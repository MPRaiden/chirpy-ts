// @ts-ignore
import { config } from './config.js';
/**
 * Handler for the /healthz endpoint
 *
 * @param req {Request} - the incoming request
 * @param res {Response} - the outgoing response
 */
export async function handlerReadiness(req, res) {
    res.set({
        'Content-Type': 'text/plain; charset=utf-8',
    });
    res.send("OK");
}
export async function handlerNumRequests(req, res) {
    res.send(`Hits: ${config.fileserverhits}`);
}
export async function handlerResetNumRequests(req, res) {
    config.fileserverhits = 0;
    res.send("");
}
