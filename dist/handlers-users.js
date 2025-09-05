"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlersCreateUser = handlersCreateUser;
exports.handlersDeleteUsers = handlersDeleteUsers;
exports.handlersLogin = handlersLogin;
const errors_1 = require("./errors");
const users_1 = require("./lib/queries/users");
const config_1 = require("./config");
const auth_1 = require("./auth");
const helpers_1 = require("./helpers");
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
        let expiresInSeconds = reqBody?.expiresInSeconds;
        if (typeof (email) !== "string" || email.length === 0) {
            throw new errors_1.BadRequestError("email missing from request body");
        }
        if (typeof (password) !== "string" || password.length === 0) {
            throw new errors_1.BadRequestError("password missing from requst body");
        }
        if (!expiresInSeconds || expiresInSeconds > 3600 || !(0, helpers_1.isPositiveInteger)(expiresInSeconds)) {
            expiresInSeconds = 3600;
        }
        const user = await (0, users_1.getUserByEmail)(email);
        if (!user) {
            throw new errors_1.UnauthorizedRequestError("Incorrect email or password");
        }
        const match = await (0, auth_1.checkPasswordHash)(password, user.hashed_password);
        if (!match) {
            throw new errors_1.UnauthorizedRequestError("Incorrect email or password");
        }
        const signedJWT = (0, auth_1.makeJWT)(user.id, expiresInSeconds, config_1.config.jwtSecret);
        res.status(200).json({
            id: user.id,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            email: user.email,
            token: signedJWT,
        });
    }
    catch (error) {
        next(error);
    }
}
