import { db } from "../index"
import { NewUser, users } from "../db/schema"

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
