import { db, users } from "database";

export async function createUser({ nickname }: { nickname: string }) {
  const newUser = await db
    .insert(users)
    .values({ id: crypto.randomUUID(), email: "", nickname })
    .returning();
  return newUser[0];
}
