import { asc, desc, eq, sql, and } from "drizzle-orm";
import {
  db,
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
  Game,
} from "database";
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

  const players = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.nickname,
      nickname: users.nickname,
      emailVerified: users.emailVerified,
      image: users.image,
      createdAt: users.createdAt,
    })
    .from(usersToGames)
    .innerJoin(users, eq(usersToGames.userId, users.id))
    .where(eq(usersToGames.gameId, game.id));

  return {
    game,
    players,
  };
}

export async function getGamePageInfo({
  game,
  players,
}: {
  game: Game;
  players: User[];
}) {
  const hostResponse = await db
    .select({ hostId: rooms.hostId })
    .from(rooms)
    .where(eq(rooms.code, game.roomCode));
  const hostId = hostResponse.length > 0 ? hostResponse[0].hostId : null;

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
    .where(eq(questionsToGames.gameId, game.id))
    .orderBy(asc(questionsToGames.round), asc(questionsToGames.createdAt));

  const gameRoundGenerations = await getGameRoundGenerations({
    gameId: game.id,
    round: game.round,
  });

  let submittedPlayers: string[] = [];
  let votedPlayers: { user: User; vote: Vote }[] = [];

  if (gameRoundGenerations.length > 0) {
    // Grab only the generations where selected is true because those are the ones that are submitted for face-offs.
    submittedPlayers = getSubmittedPlayers({
      faceOffGenerations: gameRoundGenerations.filter(
        (generation) => generation.generation.selected,
      ),
    });
    votedPlayers = await getVotesByGameRound({
      gameId: game.id,
      round: game.round,
    });
  }
  return {
    hostId,
    game: game,
    players: players,
    questions: gameQuestions,
    gameRoundGenerations,
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
    .where(and(eq(generations.gameId, gameId), eq(generations.selected, true)))
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
      }),
    )
    .returning();

  return usersToGame;
}
