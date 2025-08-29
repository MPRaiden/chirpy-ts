"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlersCreateUser = handlersCreateUser;
exports.handlersDeleteUsers = handlersDeleteUsers;
const errors_1 = require("./errors");
const users_1 = require("./lib/queries/users");
const config_1 = require("./config");
async function handlersCreateUser(req, res, next) {
    try {
        const reqBody = req.body;
        const email = reqBody.email;
        if (typeof (email) !== "string" || email.length === 0) {
            throw new errors_1.BadRequestError("email missing from request body");
        }
        const newUser = { email };
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
