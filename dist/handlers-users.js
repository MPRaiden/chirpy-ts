import { BadRequestError, ForbiddenRequestError } from "./errors.js";
import { createUser, deleteUsers } from "./lib/queries/users.js";
import { config } from "./config.js";
export async function handlersCreateUser(req, res, next) {
    try {
        const reqBody = req.body;
        const email = reqBody.email;
        if (typeof (email) !== "string" || email.length === 0) {
            throw new BadRequestError("email missing from request body");
        }
        const newUser = { email };
        const created = await createUser(newUser);
        if (!created) {
            throw new BadRequestError("user already exists");
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
export async function handlersDeleteUsers(req, res, next) {
    try {
        if (config.platform !== "dev") {
            throw new ForbiddenRequestError("this endpoint is only allowed in DEV environment");
        }
        await deleteUsers();
    }
    catch (error) {
        next(error);
    }
    res.status(200).json({
        "status": "ok"
    });
}
