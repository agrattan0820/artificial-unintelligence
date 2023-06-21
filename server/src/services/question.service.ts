import { and, eq, inArray } from "drizzle-orm";
import { db } from "../../db/db";
import { generations, questions, votes } from "../../db/schema";

export const getQuestionById = async ({ id }: { id: number }) => {
  const question = await db
    .select()
    .from(questions)
    .where(eq(questions.id, id));

  return question[0];
};

export const getQuestionVotes = async ({
  gameId,
  questionId,
}: {
  gameId: number;
  questionId: number;
}) => {
  const getAssociatedGenerations = await db
    .select()
    .from(generations)
    .where(
      and(
        eq(generations.gameId, gameId),
        eq(generations.questionId, questionId)
      )
    );

  const questionVotes = await db
    .select()
    .from(votes)
    .where(
      inArray(
        votes.generationId,
        getAssociatedGenerations.map((generation) => generation.id)
      )
    );

  return questionVotes;
};
