import crypto from "crypto";
import { describe, expect, test } from "@jest/globals";

import { filterFaceOffGenerationsByQuestionId } from "../services/generation.service";
import type { GameRoundGeneration } from "../types";

describe("filterGameRoundGenerationsByQuestionId", () => {
  test("expects the filtered array to not have any generations from other questions", () => {
    const testQuestionId = 2;

    const user1 = crypto.randomUUID();
    const user2 = crypto.randomUUID();
    const user3 = crypto.randomUUID();
    const user4 = crypto.randomUUID();

    const faceOffGenerations: GameRoundGeneration[] = [
      {
        generation: {
          id: 2,
          createdAt: new Date(),
          userId: user1,
          text: "A dog eating a burger",
          questionId: 2,
          gameId: 2,
          imageUrl: "LINK TO IMAGE",
          selected: true,
        },
        question: {
          id: 2,
          text: "This is a question",
          gameId: 2,
          round: 1,
          player1: user1,
          player2: user2,
          createdAt: new Date(),
        },
        user: {
          id: user1,
          nickname: "Big Al",
          email: "",
          createdAt: new Date(),
        },
      },
      {
        generation: {
          id: 3,
          createdAt: new Date(),
          userId: user2,
          text: "A dog eating a salmon",
          questionId: 2,
          gameId: 2,
          imageUrl: "LINK TO IMAGE",
          selected: true,
        },
        question: {
          id: 2,
          text: "This is a question",
          gameId: 2,
          round: 1,
          player1: user1,
          player2: user2,
          createdAt: new Date(),
        },
        user: {
          id: user2,
          nickname: "Big Jim",
          email: "",
          createdAt: new Date(),
        },
      },
      {
        generation: {
          id: 4,
          createdAt: new Date(),
          userId: user3,
          text: "A dog eating a pop tart",
          questionId: 2,
          gameId: 2,
          imageUrl: "LINK TO IMAGE",
          selected: true,
        },
        question: {
          id: 3,
          text: "This is a question",
          gameId: 2,
          round: 1,
          player1: user3,
          player2: user4,
          createdAt: new Date(),
        },
        user: {
          id: user3,
          nickname: "Big Tom",
          email: "",
          createdAt: new Date(),
        },
      },
      {
        generation: {
          id: 5,
          createdAt: new Date(),
          userId: user4,
          text: "A dog eating a hot dog",
          questionId: 2,
          gameId: 2,
          imageUrl: "LINK TO IMAGE",
          selected: true,
        },
        question: {
          id: 3,
          text: "This is a question",
          gameId: 2,
          round: 1,
          player1: user3,
          player2: user4,
          createdAt: new Date(),
        },
        user: {
          id: user4,
          nickname: "Big Tom",
          email: "",
          createdAt: new Date(),
        },
      },
    ];

    const filteredGenerations = filterFaceOffGenerationsByQuestionId({
      questionId: testQuestionId,
      faceOffGenerations,
    });

    expect(filteredGenerations.length).toBe(2);

    const includesOtherQuestions = filteredGenerations.some(
      (generation) => generation.questionId !== testQuestionId
    );

    expect(includesOtherQuestions).toBe(false);
  });
});
