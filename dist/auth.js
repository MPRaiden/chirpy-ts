"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.checkPasswordHash = checkPasswordHash;
exports.makeJWT = makeJWT;
exports.validateJWT = validateJWT;
exports.getBearerToken = getBearerToken;
exports.makeRefreshToken = makeRefreshToken;
exports.getRefreshTokenString = getRefreshTokenString;
const bcrypt_1 = __importDefault(require("bcrypt"));
const helpers_1 = require("./helpers");
const jwt = __importStar(require("jsonwebtoken"));
const errors_1 = require("./errors");
const node_crypto_1 = __importDefault(require("node:crypto"));
async function hashPassword(password) {
    const SALT_ROUNDS = (0, helpers_1.envOrThrow)(process.env.SALT_ROUNDS);
    const saltRounds = Number(SALT_ROUNDS);
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
function makeJWT(userID, expiresIn, secret) {
    const now = Math.floor(Date.now() / 1000);
    const payload = { iss: "chirpy", sub: userID, iat: now, exp: now + expiresIn };
    const signedJWK = jwt.sign(payload, secret);
    return signedJWK;
}
function validateJWT(tokenString, secret) {
    try {
        const decodedTokenPayload = jwt.verify(tokenString, secret);
        if (decodedTokenPayload && typeof decodedTokenPayload === "object" && "sub" in decodedTokenPayload && typeof decodedTokenPayload.sub === "string") {
            return decodedTokenPayload.sub;
        }
        throw new errors_1.UnauthorizedRequestError("function validateJWT() - invalid token payload");
    }
    catch (error) {
        throw new errors_1.UnauthorizedRequestError("function validateJWT() - invalid or expired token");
    }
}
function getBearerToken(req) {
    const jwtToken = req.get("Authorization");
    if (!jwtToken) {
        throw new errors_1.UnauthorizedRequestError("function getBearerToken() - missing jwt token");
    }
    const trimmedHeader = jwtToken.trim();
    if (!trimmedHeader.startsWith("Bearer ")) {
        throw new errors_1.BadRequestError("function getBearerToken() - jwt token missing Bearer prefix");
    }
    else {
        const token = trimmedHeader.slice("Bearer ".length).trim();
        if (!token) {
            throw new errors_1.BadRequestError("function getBearerToken() - jwtToken is malformed");
        }
        return token;
    }
}
function makeRefreshToken() {
    const randData = node_crypto_1.default.randomBytes(32).toString('hex');
    return randData;
}
function getRefreshTokenString(req) {
    const refreshToken = req.get("Authorization");
    if (!refreshToken) {
        throw new errors_1.UnauthorizedRequestError("function getRefreshToken() - missing refresh token");
    }
    const trimmedHeader = refreshToken.trim();
    if (!trimmedHeader.startsWith("Bearer")) {
        throw new errors_1.BadRequestError("function getRefreshToken() - refresh token missing Bearer prefix");
    }
    else {
        const token = trimmedHeader.slice("Bearer".length).trim();
        if (!token) {
            throw new errors_1.BadRequestError("function getRefreshToken() - refresh token is malformed");
        }
        return token;
    }
}
