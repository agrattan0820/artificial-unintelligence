import { and, asc, desc, eq, sql } from "drizzle-orm";
import { db } from "../../db/db";
import {
  NewGame,
  User,
  Vote,
  games,
  generations,
  usersToGames,
  users,
  rooms,
  questionsToGames,
  questions,
  votes,
} from "../../db/schema";
import {
  getGameRoundGenerations,
  getSubmittedPlayers,
} from "./generation.service";
import { getVotesByGameRound } from "./vote.service";

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
  const getGame = await db.select().from(games).where(eq(games.id, gameId));

  if (getGame.length === 0) {
    return null;
  }

  const game = getGame[0];

  const players = (await db
    .select({
      id: users.id,
      nickname: users.nickname,
      createdAt: users.createdAt,
    })
    .from(usersToGames)
    .innerJoin(users, eq(usersToGames.userId, users.id))
    .where(eq(usersToGames.gameId, game.id))) as User[];

  return {
    game,
    players,
  };
}

// TODO: create reusuable function with game info query logic?
export async function getPageGameInfoByRoomCode({ code }: { code: string }) {
  const hostResponse = await db
    .select({ hostId: rooms.hostId })
    .from(rooms)
    .where(eq(rooms.code, code));
  const hostId = hostResponse.length > 0 ? hostResponse[0].hostId : null;

  const latestGames = await db
    .select()
    .from(games)
    .where(eq(games.roomCode, code))
    .orderBy(desc(games.createdAt));

  if (latestGames.length === 0) {
    return null;
  }

  const latestGame = latestGames[0];

  const players = (await db
    .select({
      id: users.id,
      nickname: users.nickname,
      createdAt: users.createdAt,
    })
    .from(usersToGames)
    .innerJoin(users, eq(usersToGames.userId, users.id))
    .where(eq(usersToGames.gameId, latestGame.id))) as User[];

  const gameQuestions = await db
    .select({
      id: questions.id,
      text: questions.text,
      round: questionsToGames.round,
      gameId: questionsToGames.gameId,
      player1: questionsToGames.player1,
      player2: questionsToGames.player2,
      createdAt: questionsToGames.createdAt,
    })
    .from(questionsToGames)
    .innerJoin(questions, eq(questions.id, questionsToGames.questionId))
    .where(eq(questionsToGames.gameId, latestGame.id))
    .orderBy(asc(questionsToGames.round), asc(questionsToGames.createdAt));

  const gameRoundGenerations = await getGameRoundGenerations({
    gameId: latestGame.id,
    round: latestGame.round,
  });

  let submittedPlayers: number[] = [];
  let votedPlayers: { user: User; vote: Vote }[] = [];

  if (gameRoundGenerations.length > 0) {
    submittedPlayers = getSubmittedPlayers({ gameRoundGenerations });
    votedPlayers = await getVotesByGameRound({
      gameId: latestGame.id,
      round: latestGame.round,
    });
  }

  return {
    hostId,
    game: latestGame,
    players: players,
    questions: gameQuestions,
    submittedPlayers,
    votedPlayers,
  };
}

export async function updateGame({
  state,
  gameId,
  round,
  completedAt,
}: {
  state: string;
  gameId: number;
  round: number;
  completedAt?: Date;
}) {
  const updatedGame = await db
    .update(games)
    .set({ state, round, completedAt })
    .where(eq(games.id, gameId))
    .returning();

  return updatedGame[0];
}

export async function getLeaderboardById({ gameId }: { gameId: number }) {
  const userListOrderedByPoints = await db
    .select({
      user: users,
      points: usersToGames.points,
    })
    .from(users)
    .innerJoin(usersToGames, eq(users.id, usersToGames.userId))
    .where(eq(usersToGames.gameId, gameId))
    .orderBy(desc(usersToGames.points));

  let standing = 0;
  const userListWithStandings = userListOrderedByPoints.map((result, i) => {
    if (i === 0 || userListOrderedByPoints[i - 1].points !== result.points) {
      standing++;
    }

    return {
      ...result,
      standing,
    };
  });

  const allGenerations = await db
    .select({
      question: questions,
      generation: generations,
      user: users,
      voteCount: sql<number>`count(${votes.id})::int`,
    })
    .from(generations)
    .innerJoin(questions, eq(generations.questionId, questions.id))
    .innerJoin(users, eq(generations.userId, users.id))
    .leftJoin(votes, eq(generations.id, votes.generationId))
    .where(eq(generations.gameId, gameId))
    .groupBy(generations.id, questions.id, users.id);

  return {
    leaderboard: userListWithStandings,
    allGenerations,
  };
}

export async function addUsersToGame({
  players,
  gameId,
}: {
  players: User[];
  gameId: number;
}) {
  const usersToGame = await db
    .insert(usersToGames)
    .values(
      players.map((player) => {
        return { userId: player.id, gameId };
      })
    )
    .returning();

  return usersToGame;
}

export async function getUserRegenerationCount({
  gameId,
  userId,
}: {
  gameId: number;
  userId: number;
}) {
  const regenerationCount = await db
    .select({ count: usersToGames.regenerationCount })
    .from(usersToGames)
    .where(
      and(eq(usersToGames.userId, userId), eq(usersToGames.gameId, gameId))
    );

  return regenerationCount[0].count;
}

export async function incrementUserRegenerationCount({
  gameId,
  userId,
}: {
  gameId: number;
  userId: number;
}) {
  const currentCount = await getUserRegenerationCount({ gameId, userId });
  const incrementedCount = await db
    .update(usersToGames)
    .set({ regenerationCount: currentCount + 1 })
    .where(
      and(eq(usersToGames.userId, userId), eq(usersToGames.gameId, gameId))
    )
    .returning();

  return incrementedCount[0].regenerationCount;
}
