import { and, eq } from "drizzle-orm";
import { db } from "../../db/db";
import { NewGeneration, generations } from "../../db/schema";

export const getGameRoundGenerations = async ({
  gameId,
  round,
}: {
  gameId: number;
  round: number;
}) => {
  const gameRoundGenerations = await db
    .select()
    .from(generations)
    .where(and(eq(generations.gameId, gameId), eq(generations.round, round)));

  return gameRoundGenerations;
};

export const createGeneration = async (data: NewGeneration) => {
  const newGeneration = await db.insert(generations).values(data).returning();

  return newGeneration[0];
};
