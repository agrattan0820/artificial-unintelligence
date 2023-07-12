import * as crypto from "crypto";
import { db } from "../../db/db";
import {
  NewRoom,
  NewUserRoom,
  User,
  rooms,
  usersRooms,
  users,
} from "../../db/schema";
import { and, eq } from "drizzle-orm";

export async function createRoom() {
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
}

export async function joinRoom({
  userId,
  code,
}: {
  userId: number;
  code: string;
}) {
  const newUserRoomRelationship: NewUserRoom = {
    userId,
    roomCode: code,
  };

  const addUserToRoom = await db
    .insert(usersRooms)
    .values(newUserRoomRelationship)
    .returning();

  return addUserToRoom[0];
}

export async function leaveRoom({
  userId,
  code,
}: {
  userId: number;
  code: string;
}) {
  const removeUserFromRoom = await db
    .delete(usersRooms)
    .where(and(eq(usersRooms.userId, userId), eq(usersRooms.roomCode, code)))
    .returning();

  return removeUserFromRoom[0];
}

export async function getRoom({ code }: { code: string }) {
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
    .from(usersRooms)
    .innerJoin(users, eq(usersRooms.userId, users.id))
    .where(eq(usersRooms.roomCode, code))) as User[];

  return {
    ...room[0],
    players,
  };
}
