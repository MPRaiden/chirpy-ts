"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlerReadiness = handlerReadiness;
exports.handlerNumRequests = handlerNumRequests;
exports.handlersError = handlersError;
// @ts-ignore
const config_1 = require("./config");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const errors_1 = require("./errors");
/**
 * Handler for the /healthz endpoint
 *
 * @param req {Request} - the incoming request
 * @param res {Response} - the outgoing response
 */
async function handlerReadiness(req, res, next) {
    try {
        res.set({
            'Content-Type': 'text/plain; charset=utf-8',
        });
        res.send("OK");
    }
    catch (error) {
        next(error);
    }
}
async function handlerNumRequests(req, res, next) {
    try {
        res.set({
            'Content-Type': 'text/html; charset=utf-8',
        });
        const hits = config_1.config.fileserverhits;
        const filePath = path_1.default.join(process.cwd(), 'src', 'app', 'admin-metrics.html');
        fs_1.default.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.log(`function handlerNumRequests: Error reading file ${filePath}. Error - ${err}`);
                res.send("Error reading file");
                return;
            }
            res.send(data.replace("NUM", hits.toString()));
        });
    }
    catch (error) {
        next(error);
    }
}
function handlersError(err, req, res, next) {
    if (err instanceof errors_1.BadRequestError) {
        res.status(400).json({
            error: err.message
        });
    }
    else if (err instanceof errors_1.NotFoundError) {
        res.status(404).json({
            error: err.message
        });
    }
    else if (err instanceof errors_1.UnauthorizedRequestError) {
        res.status(401).json({
            error: err.message
        });
    }
    else if (err instanceof errors_1.ForbiddenRequestError) {
        res.status(403).json({
            error: err.message
        });
    }
    else {
        res.status(500).json({
            error: "Something went wrong on our end",
        });
    }
}
