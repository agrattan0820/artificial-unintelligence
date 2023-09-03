import { and, asc, desc, eq, sql } from "drizzle-orm";
import { db } from "database";
import {
  Generation,
  NewGeneration,
  generations,
  questions,
  questionsToGames,
  users,
} from "database/schema";
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
      and(
        eq(questionsToGames.gameId, generations.gameId),
        eq(questionsToGames.questionId, generations.questionId)
      )
    )
    .innerJoin(questions, eq(questions.id, generations.questionId))
    .innerJoin(users, eq(users.id, generations.userId))
    .where(
      and(eq(generations.gameId, gameId), eq(questionsToGames.round, round))
    )
    .orderBy(
      desc(questionsToGames.createdAt),
      desc(questionsToGames.questionId)
    );

  return gameRoundGenerations;
}

export async function getFaceOffGenerations({
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
      and(
        eq(questionsToGames.gameId, generations.gameId),
        eq(questionsToGames.questionId, generations.questionId)
      )
    )
    .innerJoin(questions, eq(questions.id, generations.questionId))
    .innerJoin(users, eq(users.id, generations.userId))
    .where(
      and(
        eq(generations.gameId, gameId),
        eq(questionsToGames.round, round),
        eq(generations.selected, true)
      )
    )
    .orderBy(asc(questionsToGames.createdAt), asc(questionsToGames.questionId));

  return gameRoundGenerations;
}

// TODO: test this function
export function mapGenerationsByQuestion({
  faceOffGenerations,
}: {
  faceOffGenerations: GameRoundGeneration[];
}) {
  const questionGenerationMap = faceOffGenerations.reduce<
    Record<number, QuestionGenerations>
  >((acc, curr, i) => {
    if (!acc[curr.question.id]) {
      acc[curr.question.id] = {
        question: curr.question,
        player1:
          curr.generation.userId === curr.question.player1
            ? curr.user
            : faceOffGenerations[i + 1].user,
        player1Generation:
          curr.generation.userId === curr.question.player1
            ? curr.generation
            : faceOffGenerations[i + 1].generation, // the generations are ordered by question id so instead of doing a search for the correct generation, we know that it is at the next index
        player2:
          curr.generation.userId === curr.question.player2
            ? curr.user
            : faceOffGenerations[i + 1].user,
        player2Generation:
          curr.generation.userId === curr.question.player2
            ? curr.generation
            : faceOffGenerations[i + 1].generation,
      };
    }

    return acc;
  }, {});

  const questionGenerations = Object.values(questionGenerationMap);

  return questionGenerations;
}

// TODO: Test this function
export function getSubmittedPlayers({
  faceOffGenerations,
}: {
  faceOffGenerations: GameRoundGeneration[];
}) {
  const userGenerationCountMap = new Map<number, number>();
  const submittedUsers = faceOffGenerations.reduce<number[]>((acc, curr) => {
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

export function filterFaceOffGenerationsByQuestionId({
  questionId,
  faceOffGenerations,
}: {
  questionId: number;
  faceOffGenerations: GameRoundGeneration[];
}) {
  const filteredGenerations = faceOffGenerations.reduce<Generation[]>(
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

export async function getGenerationCount({
  gameId,
  userId,
  questionId,
}: {
  gameId: number;
  userId: number;
  questionId: number;
}) {
  const generationCount = await db
    .select({
      count: sql<number>`count(${generations.id})::int`,
    })
    .from(generations)
    .where(
      and(
        eq(generations.gameId, gameId),
        eq(generations.userId, userId),
        eq(generations.questionId, questionId)
      )
    );

  return generationCount[0].count;
}

export async function getUserGenerationInfo({
  gameId,
  userId,
  round,
}: {
  gameId: number;
  userId: number;
  round: number;
}) {
  const generationsForUserForRound = await db
    .select({
      id: generations.id,
      gameId: generations.gameId,
      imageUrl: generations.imageUrl,
      questionId: generations.questionId,
      selected: generations.selected,
      text: generations.text,
      userId: generations.userId,
      createdAt: generations.createdAt,
    })
    .from(generations)
    .innerJoin(
      questionsToGames,
      and(
        eq(generations.gameId, questionsToGames.gameId),
        eq(generations.questionId, questionsToGames.questionId)
      )
    )
    .where(
      and(
        eq(generations.gameId, gameId),
        eq(generations.userId, userId),
        eq(questionsToGames.round, round)
      )
    );

  return generationsForUserForRound;
}

export async function setGenerationAsSubmitted({
  generationId,
}: {
  generationId: number;
}) {
  const updatedGenerations = await db
    .update(generations)
    .set({ selected: true })
    .where(eq(generations.id, generationId))
    .returning();

  return updatedGenerations[0];
}
