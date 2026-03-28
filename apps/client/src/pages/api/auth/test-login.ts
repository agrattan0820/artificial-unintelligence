import type { NextApiRequest, NextApiResponse } from "next";
import { db, users, sessions } from "database";
import { eq } from "drizzle-orm";
import crypto from "crypto";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (process.env.E2E_TESTING !== "true") {
    return res.status(404).json({ error: "Not found" });
  }

  const nickname =
    typeof req.query.nickname === "string" ? req.query.nickname : "TestPlayer";

  const userId = `e2e-test-${nickname.toLowerCase().replace(/\s+/g, "-")}`;
  const sessionToken = `e2e-session-${crypto.randomUUID()}`;
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  // Upsert user
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .then((res) => res[0] ?? null);

  if (!existingUser) {
    await db.insert(users).values({
      id: userId,
      nickname,
      name: `E2E ${nickname}`,
      email: `${userId}@e2e.test`,
      emailVerified: new Date(),
      createdAt: new Date(),
    });
  }

  // Create session
  await db.insert(sessions).values({
    sessionToken,
    userId,
    expires,
  });

  // Set the session cookie
  res.setHeader(
    "Set-Cookie",
    `next-auth.session-token=${sessionToken}; Path=/; HttpOnly; SameSite=Lax`,
  );

  return res.status(200).json({ userId, nickname, sessionToken });
}
