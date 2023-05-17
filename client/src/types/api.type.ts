export type User = {
  id: number;
  nickname: string;
};

export type Room = {
  hostId: number;
  code: string;
};

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
