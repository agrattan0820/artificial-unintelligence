import { describe, expect, test } from "@jest/globals";
import { User } from "../../db/schema";
import { findNextHost } from "../services/room.service";

describe("findNextHost", () => {
  test("expects next host to not be the previous host", () => {
    const prevHostId = 1;

    const players: User[] = [
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
      {
        id: 4,
        nickname: "Big Kev",
        createdAt: new Date(),
      },
    ];

    const nextHost = findNextHost({ prevHostId, players });

    expect(nextHost).toBeDefined();

    expect(nextHost?.id).toBe(2);
  });
  test("expects to return undefined when no other players exist to become host", () => {
    const prevHostId = 1;

    const players: User[] = [
      {
        id: 1,
        nickname: "Big Al",
        createdAt: new Date(),
      },
    ];

    const nextHost = findNextHost({ prevHostId, players });

    expect(nextHost).toBeUndefined();
  });
});
