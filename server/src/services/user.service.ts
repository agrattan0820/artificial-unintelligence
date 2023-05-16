import { db } from "../../db/db";
import { NewUser, users } from "../../db/schema";

export const createUser = async (data: { nickname: string }) => {
  const newUser: NewUser = {
    nickname: data.nickname,
  };
  const insertedUsers = await db.insert(users).values(newUser).returning();
  return insertedUsers[0];
};
