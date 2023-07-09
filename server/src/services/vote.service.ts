import { eq, and, inArray } from "drizzle-orm";
import { db } from "../../db/db";
import { games, generations, questions, users, votes } from "../../db/schema";

export async function createVote({
  userId,
  generationId,
}: {
  userId: number;
  generationId: number;
}) {
  const newVote = await db
    .insert(votes)
    .values({ userId, generationId })
    .returning();
  return newVote[0];
}

export async function getVotesByQuestionId({
  questionId,
}: {
  questionId: number;
}) {
  const getAssociatedGenerations = await db
    .select()
    .from(generations)
    .where(and(eq(generations.questionId, questionId)));

  const questionVotes = await db
    .select({
      vote: votes,
      user: users,
    })
    .from(votes)
    .innerJoin(users, eq(votes.userId, users.id))
    .where(
      inArray(
        votes.generationId,
        getAssociatedGenerations.map((generation) => generation.id)
      )
    );

  return questionVotes;
}

export async function getVotesByGameRound({
  gameId,
  round,
}: {
  gameId: number;
  round: number;
}) {
  const votesByGameRound = await db
    .select({
      vote: votes,
      user: users,
    })
    .from(votes)
    .innerJoin(users, eq(votes.userId, users.id))
    .innerJoin(generations, eq(votes.generationId, generations.id))
    .innerJoin(questions, eq(generations.questionId, questions.id))
    .innerJoin(games, eq(questions.gameId, games.id))
    .where(and(eq(games.id, gameId), eq(games.round, round)));

  return votesByGameRound;
}
