import crypto from "crypto";
import { User } from "database";
import { describe, expect, test } from "@jest/globals";

import { findNextHost } from "../services/room.service";

describe("findNextHost", () => {
  test("expects next host to not be the previous host", () => {
    const prevHostId = crypto.randomUUID();

    const players: User[] = [
      {
        id: prevHostId,
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
      {
        id: crypto.randomUUID(),
        nickname: "Big Kev",
        email: "",
        createdAt: new Date(),
      },
    ];

    const nextHost = findNextHost({ prevHostId, players });

    expect(nextHost).toBeDefined();

    expect(nextHost?.id).toBe(2);
  });
  test("expects to return undefined when no other players exist to become host", () => {
    const prevHostId = crypto.randomUUID();

    const players: User[] = [
      {
        id: prevHostId,
        nickname: "Big Al",
        email: "",
        createdAt: new Date(),
      },
    ];

    const nextHost = findNextHost({ prevHostId, players });

    expect(nextHost).toBeUndefined();
  });
});
