import { db } from "../index"
import { NewUser, users } from "../db/schema"
import { eq} from 'drizzle-orm'

export async function createUser(user: NewUser) {
  const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning()
  return result
}

export async function updateUserMailPass(user: NewUser, userId: string) {
  await db.update(users).set({'email': user.email, 'hashed_password': user.hashed_password}).where(eq(users.id, userId))
}

export async function deleteUsers() {
  await db.delete(users)
}

export async function getUserByEmail(email:string) {
  const [result] = await db.select().from(users).where(eq(users.email, email))
  return result
}

export async function getUserById(userId: string) {
  const [result] = await db.select().from(users).where(eq(users.id, userId))
  return result
}

export async function updateUserToRed(userId: string) {
  await db.update(users).set({'is_chirpy_red': true}).where(eq(users.id, userId))
}

