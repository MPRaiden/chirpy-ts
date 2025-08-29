"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envOrThrow = envOrThrow;
function envOrThrow(key) {
    if (key === undefined) {
        throw new Error(`function envOrThrow() - key "${key}" is undefined`);
    }
    return key;
}
