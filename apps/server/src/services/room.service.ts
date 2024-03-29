import * as crypto from "crypto";
import {
  db,
  NewRoom,
  NewUserRoom,
  User,
  rooms,
  usersToRooms,
  users,
} from "database";
import { and, eq } from "drizzle-orm";

export async function createRoom({ hostId }: { hostId: string }) {
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
    hostId,
    code: roomCode,
  };
  const createRoom = await db.insert(rooms).values(newRoom).returning();

  return createRoom[0];
}

export async function joinRoom({
  userId,
  code,
}: {
  userId: string;
  code: string;
}) {
  const newUserRoomRelationship: NewUserRoom = {
    userId,
    roomCode: code,
  };

  const addUserToRoom = await db
    .insert(usersToRooms)
    .values(newUserRoomRelationship)
    .returning();

  return addUserToRoom[0];
}

export async function leaveRoom({
  userId,
  code,
}: {
  userId: string;
  code: string;
}) {
  const removeUserFromRoom = await db
    .delete(usersToRooms)
    .where(
      and(eq(usersToRooms.userId, userId), eq(usersToRooms.roomCode, code))
    )
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
      name: users.name,
      email: users.email,
      emailVerified: users.emailVerified,
      image: users.image,
      createdAt: users.createdAt,
    })
    .from(usersToRooms)
    .innerJoin(users, eq(usersToRooms.userId, users.id))
    .where(eq(usersToRooms.roomCode, code))) as User[];

  return {
    ...room[0],
    players,
  };
}

export async function checkRoomForUserAndAdd({
  userId,
  roomCode,
}: {
  userId: string;
  roomCode: string;
}) {
  let roomInfo = await getRoom({ code: roomCode });
  const playerInRoom = roomInfo
    ? roomInfo.players.some((player) => player.id === userId)
    : false;
  if (roomInfo && !playerInRoom) {
    await joinRoom({ userId, code: roomCode });
    roomInfo = await getRoom({ code: roomCode });
  }
  return roomInfo;
}

export async function updateRoomHost({
  newHostId,
  roomCode,
}: {
  newHostId: string;
  roomCode: string;
}) {
  const updatedRoomInfo = await db
    .update(rooms)
    .set({ hostId: newHostId })
    .where(eq(rooms.code, roomCode))
    .returning();

  return updatedRoomInfo[0];
}

export function findNextHost({
  prevHostId,
  players,
}: {
  prevHostId: string | null;
  players: User[];
}) {
  const nextHost = players.find((player) => player.id !== prevHostId);

  return nextHost;
}
