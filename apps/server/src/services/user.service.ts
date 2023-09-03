import { db } from "database";
import { users } from "database/schema";

export async function createUser({ nickname }: { nickname: string }) {
  const newUser = await db.insert(users).values({ nickname }).returning();
  return newUser[0];
}
