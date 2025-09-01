"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlersCreateUser = handlersCreateUser;
exports.handlersDeleteUsers = handlersDeleteUsers;
exports.handlersLogin = handlersLogin;
const errors_1 = require("./errors");
const users_1 = require("./lib/queries/users");
const config_1 = require("./config");
const auth_1 = require("./auth");
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
        if (typeof (email) !== "string" || password.length === 0) {
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
        res.status(200).json({
            id: user.id,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            email: user.email,
        });
    }
    catch (error) {
        next(error);
    }
}
