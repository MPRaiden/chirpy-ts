"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlersCreateChirp = handlersCreateChirp;
exports.handlersGetChirps = handlersGetChirps;
const errors_1 = require("./errors");
const chirps_1 = require("./lib/queries/chirps");
async function handlersCreateChirp(req, res, next) {
    try {
        const reqBody = req.body;
        const userId = reqBody.userId;
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
        if (!chirps) {
            throw new errors_1.BadRequestError("something went wrong with retrieving chirps");
        }
        res.status(200).json(chirps);
    }
    catch (error) {
        next(error);
    }
}
