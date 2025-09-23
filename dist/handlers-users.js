"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlersCreateUser = handlersCreateUser;
exports.handlersDeleteUsers = handlersDeleteUsers;
exports.handlersLogin = handlersLogin;
exports.handlerRefreshToken = handlerRefreshToken;
exports.handlerRevokeRefreshToken = handlerRevokeRefreshToken;
const errors_1 = require("./errors");
const users_1 = require("./lib/queries/users");
const config_1 = require("./config");
const auth_1 = require("./auth");
const tokens_1 = require("./lib/queries/tokens");
async function handlersCreateUser(req, res, next) {
    try {
        const reqBody = req.body;
        const email = reqBody.email;
        const password = reqBody.password;
        if (typeof (email) !== "string" || email.length === 0) {
            throw new errors_1.BadRequestError("email missing from request body");
        }
        if (typeof (email) !== "string" || password.length === 0) {
            throw new errors_1.BadRequestError("password missing from requst body");
        }
        const hashedPassword = await (0, auth_1.hashPassword)(password);
        const newUser = { email: email, hashed_password: hashedPassword };
        const created = await (0, users_1.createUser)(newUser);
        if (!created) {
            throw new errors_1.BadRequestError("user already exists");
        }
        res.status(201).json({
            id: created.id,
            createdAt: created.createdAt,
            updatedAt: created.updatedAt,
            email: created.email,
        });
    }
    catch (error) {
        next(error);
    }
}
async function handlersDeleteUsers(req, res, next) {
    try {
        if (config_1.config.platform !== "dev") {
            throw new errors_1.ForbiddenRequestError("this endpoint is only allowed in DEV environment");
        }
        await (0, users_1.deleteUsers)();
    }
    catch (error) {
        next(error);
    }
    res.status(200).json({
        "status": "ok"
    });
}
async function handlersLogin(req, res, next) {
    try {
        const reqBody = req.body;
        const email = reqBody.email;
        const password = reqBody.password;
        if (typeof (email) !== "string" || email.length === 0) {
            throw new errors_1.BadRequestError("email missing from request body");
        }
        if (typeof (password) !== "string" || password.length === 0) {
            throw new errors_1.BadRequestError("password missing from requst body");
        }
        const user = await (0, users_1.getUserByEmail)(email);
        if (!user) {
            throw new errors_1.UnauthorizedRequestError("Incorrect email or password");
        }
        const match = await (0, auth_1.checkPasswordHash)(password, user.hashed_password);
        if (!match) {
            throw new errors_1.UnauthorizedRequestError("Incorrect email or password");
        }
        const signedJWT = (0, auth_1.makeJWT)(user.id, 3600, config_1.config.jwtSecret);
        const refreshToken = (0, auth_1.makeRefreshToken)();
        const expiresAt = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);
        await (0, tokens_1.insertRefreshToken)({ token: refreshToken, userId: user.id, expiresAt: expiresAt, revokedAt: null });
        res.status(200).json({
            id: user.id,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            email: user.email,
            token: signedJWT,
            refreshToken: refreshToken,
        });
    }
    catch (error) {
        next(error);
    }
}
async function handlerRefreshToken(req, res, next) {
    try {
        const refreshTokenStr = (0, auth_1.getRefreshTokenString)(req);
        const token = await (0, tokens_1.getRefreshTokenByValue)(refreshTokenStr);
        const now = new Date();
        if (!token || token.revokedAt || token.expiresAt < now) {
            res.status(401).send();
            return;
        }
        else {
            const user = await (0, tokens_1.getUserByRefreshToken)(token);
            if (!user) {
                res.status(401).send();
                return;
            }
            const newJWTToken = (0, auth_1.makeJWT)(user.id, 3600, config_1.config.jwtSecret);
            res.status(200).json({
                "token": newJWTToken
            });
        }
    }
    catch (error) {
        next(error);
    }
}
async function handlerRevokeRefreshToken(req, res, next) {
    try {
        const refreshTokenStr = (0, auth_1.getRefreshTokenString)(req);
        const token = await (0, tokens_1.getRefreshTokenByValue)(refreshTokenStr);
        if (!token || token.revokedAt) {
            res.status(401).send();
            return;
        }
        const revokendToken = await (0, tokens_1.revokeToken)(token);
        // if (!revokendToken) {
        //   res.status(401).send()
        //   return
        // }
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
}
