import * as Sentry from "@sentry/nextjs";
import { Session } from "next-auth";
import { db, games, usersToRooms, usersToGames, rooms } from "database";
import { sql, eq, and, isNull, desc, gt } from "drizzle-orm";
import type { ImagesResponse } from "openai/resources";

// generate an AI image
export const generateOpenAIImage = async (prompt: string) => {
  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (response.status !== 200) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data: { result: ImagesResponse["data"] } = await response.json();

    return data.result.map((image) => image.url ?? ""); // TODO return error if image URL is not defined?
  } catch (error) {
    console.error(error);
    Sentry.captureException(error);
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
};

export const generateSDXLImage = async (prompt: string) => {
  try {
    const response = await fetch("/api/replicate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (response.status !== 200) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data: { result: string[] } = await response.json();

    return data.result;
  } catch (error) {
    console.error(error);
    Sentry.captureException(error);
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
};

export async function getRunningGame({ session }: { session: Session }) {
  const runningGame = await db
    .select({
      game: games,
      playerCount: sql<number>`count(${usersToRooms.userId})::int`,
    })
    .from(games)
    .innerJoin(usersToGames, eq(games.id, usersToGames.gameId))
    .innerJoin(usersToRooms, eq(games.roomCode, usersToRooms.roomCode))
    .where(
      and(isNull(games.completedAt), eq(usersToGames.userId, session.user.id)),
    )
    .orderBy(desc(games.createdAt))
    .groupBy(games.id)
    .having(({ playerCount }) => gt(playerCount, 0));

  return runningGame[0];
}

export async function isUserInGame({
  gameId,
  session,
}: {
  gameId: number;
  session: Session;
}) {
  const userInGame = await db
    .select()
    .from(games)
    .innerJoin(usersToGames, eq(games.id, usersToGames.gameId))
    .where(and(eq(usersToGames.userId, session.user.id), eq(games.id, gameId)));

  return userInGame[0];
}

export async function isUserInRoom({
  roomCode,
  session,
}: {
  roomCode: string;
  session: Session;
}) {
  const userInRoom = await db
    .select()
    .from(rooms)
    .innerJoin(usersToRooms, eq(rooms.code, usersToRooms.roomCode))
    .where(
      and(eq(usersToRooms.userId, session.user.id), eq(rooms.code, roomCode)),
    );

  return userInRoom[0];
}
