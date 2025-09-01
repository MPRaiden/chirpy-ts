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

export async function deleteUsers() {
  await db.delete(users)
}

export async function getUserByEmail(email:string) {
  const [result] = await db.select().from(users).where(eq(users.email, email))
  return result
}

