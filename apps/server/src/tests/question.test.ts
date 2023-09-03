import { describe, expect, test } from "@jest/globals";
import { prepareQuestionsForGame } from "../services/question.service";
import { User } from "database/schema";

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
          id: 1,
          nickname: "Big Al",
          createdAt: new Date(),
        },
        {
          id: 2,
          nickname: "Big Dan",
          createdAt: new Date(),
        },
        {
          id: 3,
          nickname: "Big Tom",
          createdAt: new Date(),
        },
      ],
    };
    const preparedQuestions = prepareQuestionsForGame(params);

    expect(preparedQuestions.length).toBe(9);
  });
});
