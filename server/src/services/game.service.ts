import { asc, desc, eq } from "drizzle-orm";
import { db } from "../../db/db";
import {
  NewGame,
  User,
  games,
  questions,
  rooms,
  userRooms,
  users,
} from "../../db/schema";

export async function createGame({ code }: { code: string }) {
  const newGame: NewGame = {
    state: "START_GAME",
    roomCode: code,
    round: 1,
  };
  const createRoom = await db.insert(games).values(newGame).returning();

  return createRoom[0];
}

export async function getGameInfo({ gameId }: { gameId: number }) {
  const getGame = await db
    .select({
      game: games,
      room: rooms,
    })
    .from(games)
    .innerJoin(rooms, eq(rooms.code, games.roomCode))
    .where(eq(games.id, gameId));

  if (getGame.length === 0) {
    return null;
  }

  const players = (await db
    .select({
      id: users.id,
      nickname: users.nickname,
      createdAt: users.createdAt,
    })
    .from(userRooms)
    .innerJoin(users, eq(userRooms.userId, users.id))
    .where(eq(userRooms.roomCode, getGame[0].room.code))) as User[];

  return {
    game: getGame[0].game,
    room: {
      ...getGame[0].room,
      players,
    },
  };
}

export async function getLatestGameInfoByRoomCode({ code }: { code: string }) {
  const latestGame = await db
    .select({
      game: games,
      room: rooms,
    })
    .from(games)
    .innerJoin(rooms, eq(rooms.code, games.roomCode))
    .where(eq(games.roomCode, code))
    .orderBy(desc(games.createdAt));

  if (latestGame.length === 0 || !latestGame[0].room || !latestGame[0].game) {
    return null;
  }

  const players = (await db
    .select({
      id: users.id,
      nickname: users.nickname,
      createdAt: users.createdAt,
    })
    .from(userRooms)
    .innerJoin(users, eq(userRooms.userId, users.id))
    .where(eq(userRooms.roomCode, latestGame[0].room.code))) as User[];

  const gameQuestions = await db
    .select()
    .from(questions)
    .where(eq(questions.gameId, latestGame[0].game.id))
    .orderBy(asc(questions.round), asc(questions.id));

  return {
    game: latestGame[0].game,
    room: {
      ...latestGame[0].room,
      players,
    },
    questions: gameQuestions,
  };
}

export async function updateGame({
  state,
  gameId,
  round,
}: {
  state: string;
  gameId: number;
  round: number;
}) {
  const updatedGame = await db
    .update(games)
    .set({ state, round })
    .where(eq(games.id, gameId))
    .returning();

  return updatedGame[0];
}
