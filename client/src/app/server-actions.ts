import { URL } from "@ai/utils/socket";

export type User = {
  createdAt: string;
  id: number;
  nickname: string;
};
export type Room = {
  code: string;
  createdAt: string;
};
export type RoomInfo = {
  code: string;
  createdAt: string;
  players: User[];
};
export type Game = {
  id: number;
  roomCode: string | null;
  state: string;
  round: number;
  createdAt: string;
  completedAt: string | null;
};
export type Generation = {
  createdAt: string;
  id: number;
  text: string;
  gameId: number;
};
export type Vote = {
  createdAt: string;
  id: number;
  userId: number;
};

export type GameInfo = {
  game: Game;
  room: RoomInfo;
};

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

  const data: CreateHostResponse = await response.json();

  return data;
}

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

  const data: JoinRoomResponse = await response.json();

  return data;
}

export type GetRoomInfoResponse = RoomInfo;

export async function getRoomInfo(code: string) {
  const response = await fetch(`${URL}/room/${code}`, { cache: "no-store" });

  const data: GetRoomInfoResponse = await response.json();

  return data;
}

export type GetGameInfoResponse = GameInfo;

export async function getGameInfo(code: string) {
  const response = await fetch(`${URL}/game/${code}`, { cache: "no-store" });

  const data: GetGameInfoResponse = await response.json();

  return data;
}
