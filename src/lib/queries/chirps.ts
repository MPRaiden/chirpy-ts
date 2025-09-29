import { db } from '../index'
import { chirps, NewChirp } from "../db/schema"
import { asc, desc, eq} from 'drizzle-orm'

export async function createChirp(chirp: NewChirp) {
  const [result] = await db.insert(chirps).values(chirp).onConflictDoNothing().returning()
  return result
}

export async function getChirps(sort:string = 'asc') {
  if (sort === 'asc') {
    const result = await db.select().from(chirps).orderBy(asc(chirps.createdAt))
    return result
  } 
  
  if (sort === 'desc') {
    const result = await db.select().from(chirps).orderBy(desc(chirps.createdAt))
    return result
  }
}

export async function getChirpsByUserId(userId: string, sort: string = 'asc') {
  if (sort === 'asc') {
    const result = await db.select().from(chirps).where(eq(chirps.userId, userId)).orderBy(asc(chirps.createdAt))
    return result
  }

  if (sort === 'desc') {
    const result = await db.select().from(chirps).where(eq(chirps.userId, userId)).orderBy(desc(chirps.createdAt))
    return result
  }
}

export async function getChirpById(chirpId: string) {
  const [result] = await db.select().from(chirps).where(eq(chirps.id, chirpId))
  return result
}

export async function deleteChirp(chirpID: string) {
  await db.delete(chirps).where(eq(chirps.id, chirpID))
}

