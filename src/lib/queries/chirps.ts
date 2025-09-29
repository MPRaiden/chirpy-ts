import { db } from '../index'
import { chirps, NewChirp } from "../db/schema"
import { asc, eq} from 'drizzle-orm'

export async function createChirp(chirp: NewChirp) {
  const [result] = await db.insert(chirps).values(chirp).onConflictDoNothing().returning()
  return result
}

export async function getChirps() {
  const result = await db.select().from(chirps).orderBy(asc(chirps.createdAt))
  return result
}

export async function getChirpsByUserId(userId: string) {
  const result = await db.select().from(chirps).where(eq(chirps.userId, userId))
  return result
}

export async function getChirpById(chirpId: string) {
  const [result] = await db.select().from(chirps).where(eq(chirps.id, chirpId))
  return result
}

export async function deleteChirp(chirpID: string) {
  await db.delete(chirps).where(eq(chirps.id, chirpID))
}

