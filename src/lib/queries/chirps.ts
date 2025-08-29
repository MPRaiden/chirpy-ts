import { db } from '../index'
import { chirps, NewChirp } from "../db/schema"
import { asc } from 'drizzle-orm'

export async function createChirp(chirp: NewChirp) {
  const [result] = await db.insert(chirps).values(chirp).onConflictDoNothing().returning()
  return result
}

export async function getChirps() {
  const result = await db.select().from(chirps).orderBy(asc(chirps.createdAt))
  return result
}
