import bcrypt from "bcrypt"
import { envOrThrow } from "./helpers"
import * as jwt from 'jsonwebtoken'
import { JwtPayload } from 'jsonwebtoken'
import { BadRequestError, UnauthorizedRequestError } from "./errors"
import {Request} from "express"


export async function hashPassword(password: string): Promise<string> {
  const SALT_ROUNDS = envOrThrow(process.env.SALT_ROUNDS)
  const saltRounds = Number(SALT_ROUNDS)

  if (
    Number.isNaN(saltRounds) ||
    !Number.isInteger(saltRounds) ||
    saltRounds < 4 || // pick sensible bounds
    saltRounds > 15
  ) {
    throw new Error(`Invalid SALT_ROUNDS: "${SALT_ROUNDS}"`)
  }
  
  const hashedPassword = await bcrypt.hash(password, Number(SALT_ROUNDS))

  return hashedPassword
}

export async function checkPasswordHash(password: string, hash: string): Promise<boolean> {
  const match = await bcrypt.compare(password, hash)

  return match
}

export function makeJWT(userID: string, expiresIn: number, secret: string): string {
  type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

  const now = Math.floor(Date.now() / 1000)
  const payload: payload = {iss:"chirpy", sub: userID, iat:now, exp:now +expiresIn}

  const signedJWK = jwt.sign(payload, secret)

  return signedJWK
}

export function validateJWT(tokenString: string, secret: string): string {
  try {
    const decodedTokenPayload = jwt.verify(tokenString, secret) as JwtPayload

    if (decodedTokenPayload && typeof decodedTokenPayload === "object" && "sub" in decodedTokenPayload && typeof decodedTokenPayload.sub === "string") {
      return decodedTokenPayload.sub
    }

    throw new UnauthorizedRequestError("function validateJWT() - invalid token payload")
  } catch(error) {
    throw new UnauthorizedRequestError("function validateJWT() - invalid or expired token")
  }
}

export function getBearerToken(req: Request): string {
  const jwtToken = req.get("Authorization")
  if (!jwtToken) {
    throw new UnauthorizedRequestError("function getBearerToken() - missing jwt token")
  }

  const trimmedHeader = jwtToken.trim()

  if (!trimmedHeader.startsWith("Bearer ")) {
    throw new BadRequestError("function getBearerToken() - jwt token missing Bearer prefix")
  } else {
    const token = trimmedHeader.slice("Bearer ".length).trim()

    if (!token) {
      throw new BadRequestError("function getBearerToken() - jwtToken is malformed")
    }

    return token
  } 
}
