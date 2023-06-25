import * as crypto from "crypto";
import { db } from "../../db/db";
import {
  NewRoom,
  NewUserRoom,
  User,
  rooms,
  userRooms,
  users,
} from "../../db/schema";
import { and, eq } from "drizzle-orm";

export const createRoom = async () => {
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
    code: roomCode,
  };
  const createRoom = await db.insert(rooms).values(newRoom).returning();

  return createRoom[0];
};

export const joinRoom = async ({
  userId,
  code,
}: {
  userId: number;
  code: string;
}) => {
  const newUserRoomRelationship: NewUserRoom = {
    userId,
    roomCode: code,
  };

  const addUserToRoom = await db
    .insert(userRooms)
    .values(newUserRoomRelationship)
    .returning();

  return addUserToRoom[0];
};

export const leaveRoom = async ({
  userId,
  code,
}: {
  userId: number;
  code: string;
}) => {
  const removeUserFromRoom = await db
    .delete(userRooms)
    .where(and(eq(userRooms.userId, userId), eq(userRooms.roomCode, code)))
    .returning();

  return removeUserFromRoom[0];
};

export const getRoom = async ({ code }: { code: string }) => {
  const room = await db.select().from(rooms).where(eq(rooms.code, code));

  if (room.length === 0) {
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
    .where(eq(userRooms.roomCode, code))) as User[];

  return {
    ...room[0],
    players,
  };
};
