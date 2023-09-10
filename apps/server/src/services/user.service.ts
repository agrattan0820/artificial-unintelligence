import { db, users } from "database";
import crypto from "crypto";
import { eq } from "drizzle-orm";

export async function createUser({ nickname }: { nickname: string }) {
  const newUser = await db
    .insert(users)
    .values({ id: crypto.randomUUID(), email: "", nickname })
    .returning();
  return newUser[0];
}

export async function updateUserNickname({
  userId,
  nickname,
}: {
  userId: string;
  nickname: string;
}) {
  const updatedUser = await db
    .update(users)
    .set({ nickname })
    .where(eq(users.id, userId))
    .returning();

  return updatedUser[0];
}
