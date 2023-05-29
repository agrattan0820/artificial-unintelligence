// Socket.io

import { Database } from "./supabase.types";

// export type User = {
//   id: number;
//   nickname: string;
// };

// export type Room = {
//   hostId: number;
//   code: string;
// };

export type UserRoom = {
  roomCode: string;
  userId: number;
};

export type CreateHostResponse = {
  host: User;
  room: Room;
};

export type CreateUserResponse = {
  user: User;
};

export type GetRoomResponse = {
  host: User;
  players: User[];
  room: Room;
};

export type RoomInfo = {
  players: {
    id: number | null;
    nickname: string | null;
  }[];
  room: {
    code: string;
    hostId: number | null;
  };
  host: {
    id: number;
    nickname: string;
  } | null;
};

// Supabase

export type User = Database["public"]["Tables"]["users"]["Row"];
export type Room = Database["public"]["Tables"]["rooms"]["Row"];
