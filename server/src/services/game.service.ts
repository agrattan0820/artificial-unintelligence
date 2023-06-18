import { db } from "../../db/db";
import { NewGame, games } from "../../db/schema";

export const createGame = async ({ code }: { code: string }) => {
  const newGame: NewGame = {
    roomCode: code,
  };
  const createRoom = await db.insert(games).values(newGame).returning();

  return createRoom[0];
};
