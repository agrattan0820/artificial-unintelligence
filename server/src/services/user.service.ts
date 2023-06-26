import { db } from "../../db/db";
import { users } from "../../db/schema";

export const createUser = async ({ nickname }: { nickname: string }) => {
  const newUser = await db.insert(users).values({ nickname }).returning();
  return newUser[0];
};
