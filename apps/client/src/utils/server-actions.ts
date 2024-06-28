import type { Session } from "next-auth";
import { db, games, usersToRooms, usersToGames, rooms } from "database";
import { sql, eq, and, isNull, desc, gt } from "drizzle-orm";

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
    .having(({ playerCount }) => gt(playerCount, 0))
    .limit(1);

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
    .where(and(eq(usersToGames.userId, session.user.id), eq(games.id, gameId)))
    .limit(1);

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
    )
    .limit(1);

  return userInRoom[0];
}
