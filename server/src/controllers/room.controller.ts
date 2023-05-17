import express, { Express, Request, Response } from "express";
import { getRoom, joinRoom } from "../services/room.service";
import { ClientToServerEvents, ServerToClientEvents } from "../../server";
import { Socket } from "socket.io";
import { Room, User } from "../../db/schema";

export const getRoomController = async (
  req: Request<{ code: string }>,
  res: Response
) => {
  const code = req.params.code;

  const roomInfo = await getRoom({ roomCode: code });

  if (!roomInfo) {
    res.status(404).send(`Room with room code of ${code} was not found`);
  }

  res.status(200).send(roomInfo);
};

export const joinRoomController = async (
  data: { user: User; room: Room },
  callback: (
    response:
      | {
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
        }
      | undefined
  ) => void,
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

    console.log(`Emitted message to room ${data.room.code}`);

    if (roomInfo) {
      callback(roomInfo);
    }
  } catch (error) {
    socket.emit("error", "The room the user tried to join does not exist");
  }
};
