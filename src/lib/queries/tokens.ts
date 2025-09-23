import { db } from "../index"
import { RefreshToken, refreshTokens, users} from "../db/schema"
import { eq } from "drizzle-orm"

export async function insertRefreshToken(token: RefreshToken) {
  const [result] = await db
    .insert(refreshTokens)
    .values(token)
    .onConflictDoNothing()
    .returning()
  return result
}

export async function getRefreshTokenByValue(token: string) {
  const [result] = await db.select().from(refreshTokens).where(eq(refreshTokens.token, token))

  return result
}

export async function getUserByRefreshToken(token: RefreshToken) {
  const [result] = await db.select().from(users).where(eq(users.id, token.userId))

  return result
}

export async function revokeToken(token: RefreshToken) {
  const now = new Date()
  await db.update(refreshTokens).set({'revokedAt': now, 'updatedAt': now }).where(eq(refreshTokens.token, token.token))
}

