import express, { Express, Request, Response } from "express";
import { getRoom, joinRoom } from "../services/room.service";
import { ClientToServerEvents, ServerToClientEvents } from "../../server";
import { Socket } from "socket.io";
import { Room, User } from "../../db/schema";
import { createUser } from "../services/user.service";

export const getRoomController = async (
  req: Request<{ code: string }>,
  res: Response
) => {
  try {
    const code = req.params.code;

    const roomInfo = await getRoom({ roomCode: code });

    if (!roomInfo) {
      res.status(404).send(`Room with room code of ${code} was not found`);
    }

    res.status(200).send(roomInfo);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const joinRoomControllerHTTP = async (
  req: Request<{}, {}, { nickname: string; room: Room }>,
  res: Response
) => {
  try {
    const { nickname, room } = req.body;

    const createdUser = await createUser({ nickname });
    const addUserToRoom = await joinRoom({ user: createdUser, room });
    // Unsure right now if it's necessary to return the room info
    // const roomInfo = await getRoom({ roomCode: room.code });

    console.log("[ADD USER TO ROOM]:", addUserToRoom);

    res.status(200).send({ user: createdUser });
  } catch (error) {
    res.status(500).send(error);
  }
};

export const joinRoomController = async (
  data: { user: User; room: Room },
  callback: (response: Awaited<ReturnType<typeof getRoom>>) => void,
  socket: Socket<ClientToServerEvents, ServerToClientEvents>
) => {
  try {
    const addUserToRoom = await joinRoom(data);
    console.log("[ADD USER TO ROOM]:", addUserToRoom);
    socket.join(data.room.code);
    const roomInfo = await getRoom({ roomCode: data.room.code });
    socket
      .to(data.room.code)
      .emit("message", `${data.user.nickname} is joining the room!`);

    socket.to(data.room.code).emit("roomState", roomInfo);

    console.log(`Emitted message to room ${data.room.code}`);

    if (roomInfo) {
      callback(roomInfo);
    }
  } catch (error) {
    socket.emit("error", "The room the user tried to join does not exist");
  }
};
