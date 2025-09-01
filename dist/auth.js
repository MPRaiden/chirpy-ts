"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.checkPasswordHash = checkPasswordHash;
const bcrypt_1 = __importDefault(require("bcrypt"));
const helpers_1 = require("./helpers");
const SALT_ROUNDS = (0, helpers_1.envOrThrow)(process.env.SALT_ROUNDS);
const saltRounds = Number(SALT_ROUNDS);
async function hashPassword(password) {
    if (Number.isNaN(saltRounds) ||
        !Number.isInteger(saltRounds) ||
        saltRounds < 4 || // pick sensible bounds
        saltRounds > 15) {
        throw new Error(`Invalid SALT_ROUNDS: "${SALT_ROUNDS}"`);
    }
    const hashedPassword = await bcrypt_1.default.hash(password, Number(SALT_ROUNDS));
    return hashedPassword;
}
async function checkPasswordHash(password, hash) {
    const match = await bcrypt_1.default.compare(password, hash);
    return match;
}
