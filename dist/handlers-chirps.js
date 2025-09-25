"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlersCreateChirp = handlersCreateChirp;
exports.handlersGetChirps = handlersGetChirps;
exports.handlersGetChirp = handlersGetChirp;
exports.handlersDeleteChirp = handlersDeleteChirp;
const errors_1 = require("./errors");
const chirps_1 = require("./lib/queries/chirps");
const auth_1 = require("./auth");
const config_1 = require("./config");
async function handlersCreateChirp(req, res, next) {
    try {
        const reqBody = req.body;
        const bearerToken = (0, auth_1.getBearerToken)(req);
        const userId = (0, auth_1.validateJWT)(bearerToken, config_1.config.jwtSecret);
        if (reqBody.body.length > 140) {
            throw new errors_1.BadRequestError("Chirp is too long. Max length is 140");
        }
        else {
            const profanities = ["kerfuffle", "sharbert", "fornax"];
            const words = reqBody.body.split(" ");
            for (let i = 0; i < words.length; i++) {
                const word = words[i];
                const loweredWord = word.toLowerCase();
                if (profanities.includes(loweredWord)) {
                    words[i] = "****";
                }
            }
            const cleanedChirp = words.join(" ");
            const newChirp = { userId: userId, body: cleanedChirp };
            const created = await (0, chirps_1.createChirp)(newChirp);
            if (!created) {
                throw new errors_1.BadRequestError("chirp already exists");
            }
            res.status(201).json({
                id: created.id,
                createdAt: created.createdAt,
                updatedAt: created.updatedAt,
                body: created.body,
                userId: created.userId
            });
        }
    }
    catch (error) {
        next(error);
    }
}
async function handlersGetChirps(req, res, next) {
    try {
        const chirps = await (0, chirps_1.getChirps)();
        if (chirps) {
            res.status(200).json(chirps);
        }
        else {
            throw new errors_1.NotFoundError("no chirps found");
        }
    }
    catch (error) {
        next(error);
    }
}
async function handlersGetChirp(req, res, next) {
    try {
        const params = req.params;
        const chirpID = params.chirpID;
        const chirp = await (0, chirps_1.getChirpById)(chirpID);
        if (chirp) {
            res.status(200).json(chirp);
        }
        else {
            throw new errors_1.NotFoundError(`chirp with ID "${chirpID}" not found`);
        }
    }
    catch (error) {
        next(error);
    }
}
async function handlersDeleteChirp(req, res, next) {
    try {
        const params = req.params;
        const chirpID = params.chirpID;
        const chirp = await (0, chirps_1.getChirpById)(chirpID);
        if (!chirp) {
            res.status(404).send();
            return;
        }
        const bearerToken = (0, auth_1.getBearerToken)(req);
        const userId = (0, auth_1.validateJWT)(bearerToken, config_1.config.jwtSecret);
        if (chirp.userId !== userId) {
            res.status(403).send();
            return;
        }
        await (0, chirps_1.deleteChirp)(chirpID);
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
}
