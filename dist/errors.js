"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForbiddenRequestError = exports.UnauthorizedRequestError = exports.BadRequestError = exports.NotFoundError = void 0;
class NotFoundError extends Error {
    constructor(message) {
        super(message);
    }
}
exports.NotFoundError = NotFoundError;
class BadRequestError extends Error {
    constructor(message) {
        super(message);
    }
}
exports.BadRequestError = BadRequestError;
class UnauthorizedRequestError extends Error {
    constructor(message) {
        super(message);
    }
}
exports.UnauthorizedRequestError = UnauthorizedRequestError;
class ForbiddenRequestError extends Error {
    constructor(message) {
        super(message);
    }
}
exports.ForbiddenRequestError = ForbiddenRequestError;
