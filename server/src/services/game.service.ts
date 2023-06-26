import { desc, eq } from "drizzle-orm";
import { db } from "../../db/db";
import { NewGame, User, games, rooms, userRooms, users } from "../../db/schema";

export const createGame = async ({ code }: { code: string }) => {
  const newGame: NewGame = {
    state: "START_GAME",
    roomCode: code,
    round: 1,
  };
  const createRoom = await db.insert(games).values(newGame).returning();

  return createRoom[0];
};

export const getGameInfo = async ({ gameId }: { gameId: number }) => {
  const getGame = await db
    .select({
      game: games,
      room: rooms,
    })
    .from(games)
    .fullJoin(rooms, eq(rooms.code, games.roomCode))
    .where(eq(games.id, gameId));

  if (getGame.length === 0 || !getGame[0].room) {
    return null;
  }

  const players = (await db
    .select({
      id: users.id,
      nickname: users.nickname,
      createdAt: users.createdAt,
    })
    .from(userRooms)
    .fullJoin(users, eq(userRooms.userId, users.id))
    .where(eq(userRooms.roomCode, getGame[0].room.code))) as User[];

  return {
    game: getGame[0].game,
    room: {
      ...getGame[0].room,
      players,
    },
  };
};

export const getLatestGameInfoByRoomCode = async ({
  code,
}: {
  code: string;
}) => {
  const latestGame = await db
    .select({
      game: games,
      room: rooms,
    })
    .from(games)
    .fullJoin(rooms, eq(rooms.code, games.roomCode))
    .where(eq(games.roomCode, code))
    .orderBy(desc(games.createdAt));

  if (latestGame.length === 0 || !latestGame[0].room) {
    return null;
  }

  const players = (await db
    .select({
      id: users.id,
      nickname: users.nickname,
      createdAt: users.createdAt,
    })
    .from(userRooms)
    .fullJoin(users, eq(userRooms.userId, users.id))
    .where(eq(userRooms.roomCode, latestGame[0].room.code))) as User[];

  return {
    game: latestGame[0].game,
    room: {
      ...latestGame[0].room,
      players,
    },
  };
};

export const updateGame = async ({
  state,
  gameId,
  round,
}: {
  state: string;
  gameId: number;
  round: number;
}) => {
  const updatedGame = await db
    .update(games)
    .set({ state, round })
    .where(eq(games.id, gameId))
    .returning();

  return updatedGame[0];
};
