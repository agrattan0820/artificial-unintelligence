import crypto from "crypto";
import { describe, expect, test } from "@jest/globals";
import { Generation } from "database";

import { calculateVotePoints, createVoteMap } from "../services/vote.service";
import { UserVote } from "../types";

describe("calculateVotePoints", () => {
  test("expects to add 500 points with 50% of the votes", () => {
    const newPointValue = calculateVotePoints({
      previousPointsValue: 0,
      userVoteCount: 3,
      totalVotes: 6,
    });
    expect(newPointValue).toBe(500);
  });

  test("expects to add 1000 points with 100% of the votes", () => {
    const newPointValue = calculateVotePoints({
      previousPointsValue: 0,
      userVoteCount: 8,
      totalVotes: 8,
    });
    expect(newPointValue).toBe(1000);
  });

  test("expects to add 750 points to previous point total of 1000", () => {
    const newPointValue = calculateVotePoints({
      previousPointsValue: 1000,
      userVoteCount: 3,
      totalVotes: 4,
    });
    expect(newPointValue).toBe(1750);
  });
});

describe("createVoteMap", () => {
  test("expects to create a map between users and the votes they accumlated for a face off", () => {
    const creator1 = crypto.randomUUID();
    const creator2 = crypto.randomUUID();

    const generations: Generation[] = [
      {
        id: 1,
        createdAt: new Date(),
        userId: creator1,
        text: "A dog eating a Pop Tart",
        questionId: 2,
        gameId: 2,
        imageUrl: "LINK TO IMAGE",
        selected: true,
      },
      {
        id: 2,
        createdAt: new Date(),
        userId: creator2,
        text: "A dog eating a burger",
        questionId: 2,
        gameId: 2,
        imageUrl: "LINK TO IMAGE",
        selected: true,
      },
    ];

    const voter1 = crypto.randomUUID();
    const voter2 = crypto.randomUUID();

    const userVotes: UserVote[] = [
      {
        user: {
          id: voter1,
          nickname: "Big Al",
          email: "",
          createdAt: new Date(),
        },
        vote: {
          id: 6,
          createdAt: new Date(),
          generationId: 1,
          userId: voter1,
        },
      },
      {
        user: {
          id: voter2,
          nickname: "Big Al",
          email: "",
          createdAt: new Date(),
        },
        vote: {
          id: 7,
          createdAt: new Date(),
          generationId: 2,
          userId: voter2,
        },
      },
    ];

    const voteMap = createVoteMap({ generations, userVotes });

    expect(voteMap).toEqual({
      3: 1,
      4: 1,
    });
  });
});
