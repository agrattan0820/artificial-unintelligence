import { and, eq, inArray, or } from "drizzle-orm";
import { db } from "../../db/db";
import {
  NewQuestion,
  User,
  generations,
  questions,
  users,
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

export async function generateAIQuestions(questionAmount: number) {
  const originalPrompt = `Generate a list of ${questionAmount} funny prompts for a game that's all one string with each prompt separated by a comma. For the game, players will respond to the prompt with AI generated images. Two players will respond to the prompt while the rest of the players vote on their favorite response/image. The targeted audience is between 15 and 30. The prompts should relate to pop culture, historical events, brands, and dark humor. The players already know the rules, so do not specify that they have to generate an image. Some example prompts include: The uninvited wedding guest, The new challenger in Super Smash Bros, The newly discovered animal in Australia, The new British Museum exhibit,The creature hidden in IKEA, A unique vacation spot, A cancelled children's toy, The new Olympic sport`;

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
  players,
}: {
  gameId: number;
  players: User[];
}) {
  let shuffledArray: User[] = shuffleArray([...players]);

  const amountOfRounds = 3;

  const generatedQuestions = await generateAIQuestions(
    players.length * amountOfRounds
  );

  console.log("GENERATED QUESTIONS", generatedQuestions);

  if (players.length * amountOfRounds !== generatedQuestions.length) {
    throw new Error("The incorrect amount of questions were generated");
  }

  const normalizeQuestionText = (question: string) => {
    return question.trim().endsWith(".")
      ? question.trim().slice(0, question.length - 1)
      : question.trim();
  };

  let roundCount = 0;

  const questionData: NewQuestion[] = generatedQuestions.map((question, i) => {
    if (i % players.length === 0) {
      roundCount++;
      shuffledArray = shuffleArray(shuffledArray);
    }
    return {
      text: normalizeQuestionText(question),
      gameId,
      round: roundCount,
      player1: shuffledArray[i % players.length].id,
      player2:
        i % players.length === players.length - 1
          ? shuffledArray[0].id
          : shuffledArray[(i % players.length) + 1].id,
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
