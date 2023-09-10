import { and, eq, inArray, or, sql } from "drizzle-orm";
import {
  db,
  NewQuestion,
  NewQuestionToGame,
  User,
  questions,
  questionsToGames,
} from "database";
import { shuffleArray } from "../utils";

export async function getQuestionById({ id }: { id: number }) {
  const question = await db
    .select()
    .from(questions)
    .where(eq(questions.id, id));

  return question[0];
}

export async function createQuestions(data: NewQuestion[]) {
  const newQuestions = await db.insert(questions).values(data).returning();

  return newQuestions;
}

export async function createQuestionsToGames(data: NewQuestionToGame[]) {
  const newQuestions = await db
    .insert(questionsToGames)
    .values(data)
    .returning();

  return newQuestions;
}

export async function getLeastAppearingQuestions({
  players,
}: {
  players: User[];
}) {
  const userIds = players.map((player) => player.id);

  const leastAppearingQuestions = await db
    .select({
      count: sql<number>`count(${questionsToGames.gameId})::int`,
      questionId: questions.id,
    })
    .from(questions)
    .leftJoin(
      questionsToGames,
      and(
        eq(questionsToGames.questionId, questions.id),
        or(
          inArray(questionsToGames.player1, userIds),
          inArray(questionsToGames.player2, userIds)
        )
      )
    )
    .groupBy(({ questionId }) => questionId)
    .orderBy(({ count, questionId }) => [count, questionId]);

  return leastAppearingQuestions;
}

export function prepareQuestionsForGame({
  gameId,
  questions,
  players,
}: {
  gameId: number;
  questions: { count: number; questionId: number }[];
  players: User[];
}) {
  const amountOfRounds = 3;
  let roundCount = 0;
  let shuffledPlayers = [...players];

  const lowestCount = questions[0].count;
  const lowCountArr: { count: number; questionId: number }[] = [];

  for (
    let i = 0;
    i < questions.length && questions[i].count === lowestCount;
    i++
  ) {
    lowCountArr.push(questions[i]);
  }

  // if there are enough questions with a low count, we want to shuffle through all of them to make it so that the first questions for players are always varied
  const questionsForGame =
    lowCountArr.length >= players.length * amountOfRounds
      ? shuffleArray(lowCountArr).splice(0, players.length * amountOfRounds)
      : shuffleArray(questions.slice(0, players.length * amountOfRounds));

  const questionsToGameData = questionsForGame.map((question, i) => {
    if (i % players.length === 0) {
      roundCount++;
      shuffledPlayers = shuffleArray(shuffledPlayers);
    }
    return {
      questionId: question.questionId,
      gameId,
      round: roundCount,
      player1: shuffledPlayers[i % players.length].id,
      player2:
        i % players.length === players.length - 1
          ? shuffledPlayers[0].id
          : shuffledPlayers[(i % players.length) + 1].id,
    } as NewQuestionToGame;
  });

  return questionsToGameData;
}

export async function assignQuestionsToPlayers({
  gameId,
  players,
}: {
  gameId: number;
  players: User[];
}) {
  const leastAppearingQuestions = await getLeastAppearingQuestions({ players });

  const questionsToGameData = prepareQuestionsForGame({
    gameId,
    questions: leastAppearingQuestions,
    players,
  });

  const createdQuestions = await createQuestionsToGames(questionsToGameData);

  return createdQuestions;
}

export async function getUserQuestionsForRound({
  userId,
  gameId,
  round,
}: {
  userId: string;
  gameId: number;
  round: number;
}) {
  const userQuestionsForRound = await db
    .select()
    .from(questionsToGames)
    .where(
      and(
        eq(questionsToGames.gameId, gameId),
        eq(questionsToGames.round, round),
        or(
          eq(questionsToGames.player1, userId),
          eq(questionsToGames.player2, userId)
        )
      )
    );

  return userQuestionsForRound;
}
