import { and, eq, inArray, or } from "drizzle-orm";
import { db } from "../../db/db";
import {
  NewQuestion,
  User,
  generations,
  questions,
  votes,
} from "../../db/schema";
import { openai } from "../openai";

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

export async function generateAIQuestions({
  playerCount,
}: {
  playerCount: number;
}) {
  const originalPrompt = `Generate a list of ${playerCount} funny prompts for a game that's all one string with each prompt separated by a comma. For the game, players will respond to the prompt with AI generated images. Two players will respond to the prompt while the rest of the players vote on their favorite response/image. The targeted audience is between 15 and 30. The prompts should relate to pop culture, historical events, celebrities, brands, and dark humor. The players already know the rules, so do not specify that they have to generate an image. Some example prompts include: The uninvited wedding guest, The new challenger in Super Smash Bros, The newly discovered animal in Australia, The new British Museum exhibit,The creature hidden in IKEA, A unique vacation spot, A cancelled children's toy, The new Olympic sport`;

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: originalPrompt }],
    });
    return response.data.choices[0].message?.content?.split(", ") ?? [];
  } catch (error) {
    if (error instanceof Error)
      console.error("Error trying to generate questions", error.message);
  }

  return [];
}

export async function assignQuestionsToPlayers({
  gameId,
  round,
  players,
}: {
  gameId: number;
  round: number;
  players: User[];
}) {
  const shuffledArray: User[] = shuffleArray([...players]);

  const generatedQuestions = await generateAIQuestions({
    playerCount: players.length,
  });

  if (shuffledArray.length !== generatedQuestions.length) {
    throw new Error(
      "The amount of shuffled users does not match the amount of generated questions"
    );
  }

  const normalizeQuestionText = (question: string) => {
    return question.trim().endsWith(".")
      ? question.trim().slice(0, question.length - 1)
      : question.trim();
  };

  const questionData: NewQuestion[] = generatedQuestions.map((question, i) => {
    return {
      text: normalizeQuestionText(question),
      gameId,
      round,
      player1: shuffledArray[i].id,
      player2:
        i === players.length - 1
          ? shuffledArray[0].id
          : shuffledArray[i + 1].id,
    };
  });

  const createdQuestions = await createQuestions(questionData);

  return createdQuestions;
}

export async function getUserQuestionsForRound({
  userId,
  gameId,
  round,
}: {
  userId: number;
  gameId: number;
  round: number;
}) {
  const userQuestionsForRound = await db
    .select()
    .from(questions)
    .where(
      and(
        eq(questions.gameId, gameId),
        eq(questions.round, round),
        or(eq(questions.player1, userId), eq(questions.player2, userId))
      )
    );

  return userQuestionsForRound;
}

export async function getQuestionVotes({ questionId }: { questionId: number }) {
  const getAssociatedGenerations = await db
    .select()
    .from(generations)
    .where(and(eq(generations.questionId, questionId)));

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
}

// UTILS

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

function shuffleArray<T>(arr: T[]) {
  for (let i = 0; i < arr.length - 2; i++) {
    const randNum = getRandomInt(i, arr.length);
    const temp = arr[i];
    arr[i] = arr[randNum];
    arr[randNum] = temp;
  }

  return arr;
}
