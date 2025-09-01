import bcrypt from "bcrypt"
import { envOrThrow } from "./helpers"

const SALT_ROUNDS = envOrThrow(process.env.SALT_ROUNDS)
const saltRounds = Number(SALT_ROUNDS)

export async function hashPassword(password: string): Promise<string> {
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

