import { and, asc, eq } from "drizzle-orm";
import { db } from "../../db/db";
import { NewGeneration, generations, questions, users } from "../../db/schema";

export async function getGameRoundGenerations({
  gameId,
  round,
}: {
  gameId: number;
  round: number;
}) {
  const gameRoundGenerations = await db
    .select({
      generation: generations,
      question: questions,
      user: users,
    })
    .from(generations)
    .innerJoin(questions, eq(questions.id, generations.questionId))
    .innerJoin(users, eq(users.id, generations.userId))
    .where(and(eq(questions.gameId, gameId), eq(questions.round, round)))
    .orderBy(asc(questions.id));

  return gameRoundGenerations;
}

export async function createGeneration(data: NewGeneration) {
  const newGeneration = await db
    .insert(generations)
    .values({
      imageUrl: data.imageUrl,
      questionId: data.questionId,
      text: data.text,
      userId: data.userId,
    })
    .returning();

  return newGeneration[0];
}
