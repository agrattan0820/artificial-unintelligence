import crypto from "crypto";
import type { User } from "database";
import { describe, expect, test } from "@jest/globals";

import { prepareQuestionsForGame } from "../services/question.service";

describe("prepareQuestionsForGame", () => {
  test("expects to contain questions with a randomized ordering of players", () => {
    const params: {
      gameId: number;
      questions: { count: number; questionId: number }[];
      players: User[];
    } = {
      gameId: 2,
      questions: [
        {
          count: 0,
          questionId: 2,
        },
        {
          count: 0,
          questionId: 3,
        },
        {
          count: 0,
          questionId: 4,
        },
        {
          count: 0,
          questionId: 5,
        },
        {
          count: 0,
          questionId: 6,
        },
        {
          count: 0,
          questionId: 7,
        },
        {
          count: 0,
          questionId: 8,
        },
        {
          count: 0,
          questionId: 9,
        },
        {
          count: 0,
          questionId: 10,
        },
      ],
      players: [
        {
          id: crypto.randomUUID(),
          nickname: "Big Al",
          email: "",
          createdAt: new Date(),
        },
        {
          id: crypto.randomUUID(),
          nickname: "Big Dan",
          email: "",
          createdAt: new Date(),
        },
        {
          id: crypto.randomUUID(),
          nickname: "Big Tom",
          email: "",
          createdAt: new Date(),
        },
      ],
    };
    const preparedQuestions = prepareQuestionsForGame(params);

    expect(preparedQuestions.length).toBe(9);
  });
});
