import { eq, and, inArray } from "drizzle-orm";
import { db } from "../../db/db";
import {
  Generation,
  games,
  generations,
  questions,
  userGames,
  users,
  votes,
} from "../../db/schema";
import { UserVote } from "../types";

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

/**
 * The scoring system (along with the rest of the game) is
 * inspired by Quiplash from the Jackbox Party Pack
 *
 * Source: https://jackboxgames.fandom.com/wiki/Quiplash_(series)
 */
export async function calculateVotePoints({
  generations,
  userVotes,
  gameId,
}: {
  generations: Generation[];
  userVotes: UserVote[];
  gameId: number;
}) {
  const pointsPerOnePercent = 10;

  const userGenerationMap = generations.reduce<Record<number, number>>(
    (acc, curr) => {
      acc[curr.id] = curr.userId;
      return acc;
    },
    {}
  );

  const voteMap = userVotes.reduce<Record<number, number>>((acc, curr) => {
    const userId = userGenerationMap[curr.vote.generationId];

    if (!acc[userId]) {
      acc[userId] = 0;
    }

    acc[userId] = acc[userId] + 1;

    return acc;
  }, {});

  const userIdArray = Object.keys(voteMap).map((id) => Number.parseInt(id));

  const previousPoints = await db
    .select()
    .from(userGames)
    .where(
      and(eq(userGames.gameId, gameId), inArray(userGames.userId, userIdArray))
    );

  await Promise.all(
    previousPoints.map(async (prev) => {
      const percentage = Math.round(
        (voteMap[prev.userId] / userVotes.length) * 100
      );
      const newValue = prev.points + percentage * pointsPerOnePercent;
      await db
        .update(userGames)
        .set({ points: newValue })
        .where(
          and(
            eq(userGames.userId, prev.userId),
            eq(userGames.gameId, prev.gameId)
          )
        );
    })
  );

  // const updatePoints = await db.update(userGames).set({points:})
}
