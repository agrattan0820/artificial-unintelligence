import { describe, expect, test } from "@jest/globals";
import {
  GameRoundGeneration,
  filterGameRoundGenerationsByQuestionId,
} from "../services/generation.service";

describe("filterGameRoundGenerationsByQuestionId", () => {
  test("expects the filtered array to not have any generations from other questions", () => {
    const testQuestionId = 2;

    const gameRoundGenerations: GameRoundGeneration[] = [
      {
        generation: {
          id: 2,
          createdAt: new Date(),
          userId: 5,
          text: "A dog eating a burger",
          questionId: 2,
          imageUrl: "LINK TO IMAGE",
        },
        question: {
          id: 2,
          text: "This is a question",
          gameId: 2,
          round: 1,
          player1: 5,
          player2: 6,
          createdAt: new Date(),
        },
        user: {
          id: 5,
          nickname: "Big Al",
          createdAt: new Date(),
        },
      },
      {
        generation: {
          id: 3,
          createdAt: new Date(),
          userId: 6,
          text: "A dog eating a salmon",
          questionId: 2,
          imageUrl: "LINK TO IMAGE",
        },
        question: {
          id: 2,
          text: "This is a question",
          gameId: 2,
          round: 1,
          player1: 5,
          player2: 6,
          createdAt: new Date(),
        },
        user: {
          id: 6,
          nickname: "Big Jim",
          createdAt: new Date(),
        },
      },
      {
        generation: {
          id: 4,
          createdAt: new Date(),
          userId: 7,
          text: "A dog eating a pop tart",
          questionId: 2,
          imageUrl: "LINK TO IMAGE",
        },
        question: {
          id: 3,
          text: "This is a question",
          gameId: 2,
          round: 1,
          player1: 7,
          player2: 8,
          createdAt: new Date(),
        },
        user: {
          id: 7,
          nickname: "Big Tom",
          createdAt: new Date(),
        },
      },
      {
        generation: {
          id: 5,
          createdAt: new Date(),
          userId: 8,
          text: "A dog eating a hot dog",
          questionId: 2,
          imageUrl: "LINK TO IMAGE",
        },
        question: {
          id: 3,
          text: "This is a question",
          gameId: 2,
          round: 1,
          player1: 7,
          player2: 8,
          createdAt: new Date(),
        },
        user: {
          id: 8,
          nickname: "Big Tom",
          createdAt: new Date(),
        },
      },
    ];

    const filteredGenerations = filterGameRoundGenerationsByQuestionId({
      questionId: testQuestionId,
      gameRoundGenerations,
    });

    expect(filteredGenerations.length).toBe(2);

    const includesOtherQuestions = filteredGenerations.some(
      (generation) => generation.questionId !== testQuestionId
    );

    expect(includesOtherQuestions).toBe(false);
  });
});
