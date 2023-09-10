import { URL } from "@ai/utils/socket";
import { Game, Generation, Question, Room, User, Vote } from "database";

export type RoomInfo = {
  hostId: string | null;
  code: string;
  createdAt: string;
  players: User[];
};

export type GameQuestion = {
  id: number;
  text: string;
  createdAt: string;
  gameId: number;
  round: number;
  player1: string;
  player2: string;
  votedOn: boolean;
};

export type UserVote = { vote: Vote; user: User };

export type GameRoundGeneration = {
  generation: Generation;
  question: {
    id: number;
    text: string;
    round: number;
    gameId: number;
    player1: string;
    player2: string;
    createdAt: Date;
  };
  user: User;
};

export type GameInfo = {
  hostId: string | null;
  game: Game;
  players: User[];
  questions: GameQuestion[];
  gameRoundGenerations: GameRoundGeneration[];
  submittedPlayers: string[];
  votedPlayers: UserVote[];
};

export type QuestionGenerations = {
  question: Question;
  player1: User;
  player1Generation: Generation;
  player2: User;
  player2Generation: Generation;
};

type ErrorResponse = { error: string };

// ! ----------> USERS <----------

export type CreateHostResponse = {
  host: User;
  room: Room;
};

export async function createHost(nickname: string) {
  const response = await fetch(`${URL}/user/createHost`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nickname,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create host and room");
  }

  const data: CreateHostResponse = await response.json();

  return data;
}

export type ExistingHostResponse = {
  room: Room;
};

export async function existingHost({
  userId,
  nickname,
}: {
  userId: string;
  nickname: string;
}) {
  const response = await fetch(`${URL}/user/existingHost`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nickname,
      userId,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create room for existing host");
  }

  const data: ExistingHostResponse = await response.json();

  return data;
}

// ! ----------> ROOMS <----------

export type JoinRoomResponse = {
  user: User;
};

export async function joinRoom({
  userId,
  nickname,
  code,
}: {
  userId: string;
  nickname: string;
  code: string;
}) {
  const response = await fetch(`${URL}/room/join`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      nickname,
      code,
    }),
  });

  if (!response.ok) {
    if (response.status === 400) {
      throw new Error("Room is full");
    }
    throw new Error("Failed to join room");
  }

  const data: JoinRoomResponse = await response.json();

  return data;
}

export type GetRoomInfoResponse = RoomInfo | ErrorResponse;

export async function getRoomInfo(code: string) {
  const response = await fetch(`${URL}/room/${code}`, { cache: "no-store" });

  if (!response.ok) {
    throw new Error("Failed to obtain room info");
  }

  const data: GetRoomInfoResponse = await response.json();

  return data;
}

// ! ----------> GAMES <----------

export type GetGameInfoResponse = GameInfo | ErrorResponse;

export async function getGameInfo(gameId: number) {
  const response = await fetch(`${URL}/game/${gameId}`, { cache: "no-store" });

  if (!response.ok) {
    throw new Error("Failed to obtain game info");
  }

  const data: GetGameInfoResponse = await response.json();

  return data;
}

export type GetGameLeaderboardResponse = {
  leaderboard: { user: User; points: number; standing: number }[];
  // winningGenerations: { question: Question; generation: Generation }[];
  allGenerations: { question: Question; generation: Generation; user: User }[];
};

export async function getLeaderboardById({ gameId }: { gameId: number }) {
  const response = await fetch(`${URL}/game/${gameId}/leaderboard`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to obtain leaderboard");
  }

  const data: GetGameLeaderboardResponse = await response.json();

  return data;
}

// ! ----------> GENERATIONS <----------

export type CreateGenerationsResponse = Generation[];

export async function createGenerations({
  userId,
  gameId,
  questionId,
  images,
}: {
  userId: string;
  gameId: number;
  questionId: number;
  images: { text: string; imageUrl: string }[];
}) {
  const response = await fetch(`${URL}/generations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, gameId, questionId, images }),
  });

  if (!response.ok) {
    throw new Error("Failed to create generations");
  }

  const data: CreateGenerationsResponse = await response.json();

  return data;
}

export type GetFaceOffsResponse = QuestionGenerations[];

export async function getFaceOffs({
  gameId,
  round,
}: {
  gameId: number;
  round: number;
}) {
  const response = await fetch(
    `${URL}/generations/gameId/${gameId}/round/${round}`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error("Failed to obtain face-offs");
  }

  const data: GetFaceOffsResponse = await response.json();

  return data;
}
