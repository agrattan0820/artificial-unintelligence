import { and, asc, eq } from "drizzle-orm";
import { db } from "../../db/db";
import {
  Generation,
  NewGeneration,
  generations,
  questions,
  questionsToGames,
  users,
} from "../../db/schema";
import { GameRoundGeneration, QuestionGenerations } from "../types";

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
    .orderBy(asc(questionsToGames.createdAt), asc(questionsToGames.questionId));

  return gameRoundGenerations;
}

// TODO: test this function
export function mapGenerationsByQuestion({
  gameRoundGenerations,
}: {
  gameRoundGenerations: GameRoundGeneration[];
}) {
  const questionGenerationMap = gameRoundGenerations.reduce<
    Record<number, QuestionGenerations>
  >((acc, curr, i) => {
    if (!acc[curr.question.id]) {
      acc[curr.question.id] = {
        question: curr.question,
        player1:
          curr.generation.userId === curr.question.player1
            ? curr.user
            : gameRoundGenerations[i + 1].user,
        player1Generation:
          curr.generation.userId === curr.question.player1
            ? curr.generation
            : gameRoundGenerations[i + 1].generation, // the generations are ordered by question id so instead of doing a search for the correct generation, we know that it is at the next index
        player2:
          curr.generation.userId === curr.question.player2
            ? curr.user
            : gameRoundGenerations[i + 1].user,
        player2Generation:
          curr.generation.userId === curr.question.player2
            ? curr.generation
            : gameRoundGenerations[i + 1].generation,
      };
    }

    return acc;
  }, {});

  const questionGenerations = Object.values(questionGenerationMap);

  return questionGenerations;
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
      userGenerationCountMap.set(currUserId, 2); // player has created two generations, they are "submitted"
      acc.push(currUserId); // add them to the array of submitted players
    }

    if (!userGenerationCountMap.has(currUserId)) {
      userGenerationCountMap.set(currUserId, 1); // player has created one generation, not yet "submitted"
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
      gameId: data.gameId,
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
