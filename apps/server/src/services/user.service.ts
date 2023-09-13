import { db, sessions, users } from "database";
import crypto from "crypto";
import { and, eq, gt } from "drizzle-orm";

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

export async function checkUserSession({
  sessionToken,
}: {
  sessionToken: string;
}) {
  const checkDBForSession = await db
    .select()
    .from(sessions)
    .where(
      and(
        eq(sessions.sessionToken, sessionToken),
        gt(sessions.expires, new Date())
      )
    );

  return checkDBForSession.length > 0;
}
