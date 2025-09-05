"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envOrThrow = envOrThrow;
exports.isPositiveInteger = isPositiveInteger;
function envOrThrow(key) {
    if (key === undefined) {
        throw new Error(`function envOrThrow() - key "${key}" is undefined`);
    }
    return key;
}
function isPositiveInteger(value) {
    // Convert the value to a number first.
    const num = Number(value);
    // Check if it's an integer and greater than 0.
    return Number.isInteger(num) && num > 0;
}
