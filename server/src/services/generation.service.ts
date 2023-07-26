import { and, asc, eq } from "drizzle-orm";
import { db } from "../../db/db";
import {
  Generation,
  NewGeneration,
  User,
  generations,
  questions,
  questionsToGames,
  users,
} from "../../db/schema";

export type GameRoundGeneration = {
  generation: Generation;
  question: {
    id: number;
    text: string;
    round: number;
    gameId: number;
    player1: number;
    player2: number;
    createdAt: Date;
  };
  user: User;
};

export async function getGameRoundGenerations({
  gameId,
  round,
}: {
  gameId: number;
  round: number;
}): Promise<GameRoundGeneration[]> {
  const gameRoundGenerations = await db
    .select({
      generation: generations,
      question: {
        id: questions.id,
        text: questions.text,
        round: questionsToGames.round,
        gameId: questionsToGames.gameId,
        player1: questionsToGames.player1,
        player2: questionsToGames.player2,
        createdAt: questionsToGames.createdAt,
      },
      user: users,
    })
    .from(generations)
    .innerJoin(
      questionsToGames,
      eq(questionsToGames.questionId, generations.questionId)
    )
    .innerJoin(questions, eq(questions.id, generations.questionId))
    .innerJoin(users, eq(users.id, generations.userId))
    .where(
      and(
        eq(questionsToGames.gameId, gameId),
        eq(questionsToGames.round, round)
      )
    )
    .orderBy(asc(questionsToGames.createdAt));

  return gameRoundGenerations;
}

// TODO: Test this function
export function getSubmittedPlayers({
  gameRoundGenerations,
}: {
  gameRoundGenerations: GameRoundGeneration[];
}) {
  const userGenerationCountMap = new Map<number, number>();
  const submittedUsers = gameRoundGenerations.reduce<number[]>((acc, curr) => {
    const currUserId = curr.generation.userId;

    if (userGenerationCountMap.get(currUserId) === 1) {
      userGenerationCountMap.set(currUserId, 2);
      acc.push(currUserId);
    }

    if (!userGenerationCountMap.has(currUserId)) {
      userGenerationCountMap.set(currUserId, 1);
    }

    return acc;
  }, []);

  return submittedUsers;
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

export function filterGameRoundGenerationsByQuestionId({
  questionId,
  gameRoundGenerations,
}: {
  questionId: number;
  gameRoundGenerations: GameRoundGeneration[];
}) {
  const filteredGenerations = gameRoundGenerations.reduce<Generation[]>(
    (acc, curr) => {
      if (curr.question.id === questionId) {
        acc.push(curr.generation);
      }

      return acc;
    },
    []
  );

  return filteredGenerations;
}
