import { db } from "../../db/db";
import { users } from "../../db/schema";

export async function createUser({ nickname }: { nickname: string }) {
  const newUser = await db.insert(users).values({ nickname }).returning();
  return newUser[0];
}
