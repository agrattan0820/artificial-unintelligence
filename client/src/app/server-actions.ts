import { URL } from "@ai/utils/socket";

export type User = {
  createdAt: string;
  id: number;
  nickname: string;
};
export type Room = {
  hostId: number | null;
  code: string;
  createdAt: string;
};
export type RoomInfo = {
  hostId: number | null;
  code: string;
  createdAt: string;
  players: User[];
};
export type Game = {
  id: number;
  roomCode: string;
  state: string;
  round: number;
  createdAt: string;
  completedAt: string | null;
};
export type Generation = {
  id: number;
  text: string;
  imageUrl: string;
  userId: number;
  questionId: number;
  gameId: number;
  selected: boolean;
  createdAt: string;
};
export type Question = {
  id: number;
  text: string;
  createdAt: string;
  gameId: number;
  round: number;
  player1: number;
  player2: number;
  votedOn: boolean;
};
export type Vote = {
  createdAt: string;
  id: number;
  userId: number;
  generationId: number;
};

export type UserVote = { vote: Vote; user: User };

export type GameRoundGeneration = {
  generation: Generation;
  question: {
    id: number;
    text: string;
    round: number;
    gameId: number;
    player1: number;
    player2: number;
    createdAt: Date;
  };
  user: User;
};

export type GameInfo = {
  hostId: number | null;
  game: Game;
  players: User[];
  questions: Question[];
  gameRoundGenerations: GameRoundGeneration[];
  submittedPlayers: number[];
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

export async function existingHost(userId: number) {
  const response = await fetch(`${URL}/user/existingHost`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
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

export async function joinRoom(nickname: string, code: string) {
  const response = await fetch(`${URL}/room/join`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
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

export async function getGameInfo(code: string) {
  const response = await fetch(`${URL}/game/${code}`, { cache: "no-store" });

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
  userId: number;
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
