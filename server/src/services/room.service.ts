import * as crypto from "crypto";
import { db } from "../../db/db";
import {
  NewRoom,
  NewUserRoom,
  Room,
  User,
  rooms,
  userRooms,
  users,
} from "../../db/schema";
import { eq } from "drizzle-orm";

export const createRoom = async (data: { host: User }) => {
  let validRoomCode = false;

  let roomCode = crypto.randomBytes(4).toString("hex");

  while (!validRoomCode) {
    const doesRoomCodeExist = await db
      .select()
      .from(rooms)
      .where(eq(rooms.code, roomCode));

    if (doesRoomCodeExist.length === 0) {
      validRoomCode = true;
      break;
    }

    roomCode = crypto.randomBytes(4).toString("hex");
  }

  const newRoom: NewRoom = {
    hostId: data.host.id,
    code: roomCode,
  };
  const createRoom = await db.insert(rooms).values(newRoom).returning();

  return createRoom[0];
};

export const joinRoom = async (data: { user: User; room: Room }) => {
  const newUserRoomRelationship: NewUserRoom = {
    userId: data.user.id,
    roomCode: data.room.code,
  };

  const addUserToRoom = await db
    .insert(userRooms)
    .values(newUserRoomRelationship)
    .returning();

  return addUserToRoom[0];
};

export const getRoomInfo = async (data: { roomCode: string }) => {
  const room = await db
    .select({
      room: {
        code: rooms.code,
        hostId: rooms.hostId,
      },
      host: {
        id: users.id,
        nickname: users.nickname,
      },
    })
    .from(rooms)
    .leftJoin(userRooms, eq(rooms.code, userRooms.roomCode))
    .leftJoin(users, eq(userRooms.userId, users.id))
    .where(eq(rooms.code, data.roomCode));

  if (!room[0]) {
    return;
  }

  const players = await db
    .select({
      id: users.id,
      nickname: users.nickname,
    })
    .from(userRooms)
    .fullJoin(users, eq(userRooms.userId, users.id))
    .where(eq(userRooms.roomCode, data.roomCode));

  return {
    ...room[0],
    players,
  };
};
