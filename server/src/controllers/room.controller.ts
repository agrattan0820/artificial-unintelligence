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

    const roomInfo = await getRoom({ code });

    if (!roomInfo) {
      res.status(404).send(`Room with room code of ${code} was not found`);
    }

    res.status(200).send(roomInfo);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const joinRoomController = async (
  req: Request<{}, {}, { nickname: string; code: string }>,
  res: Response
) => {
  try {
    const { nickname, code } = req.body;

    const createdUser = await createUser({ nickname });
    const addUserToRoom = await joinRoom({
      userId: createdUser.id,
      code,
    });
    // Unsure right now if it's necessary to return the room info
    // const roomInfo = await getRoom({ roomCode: room.code });

    console.log("[ADD USER TO ROOM]:", addUserToRoom);

    res.status(200).send({ user: createdUser });
  } catch (error) {
    res.status(500).send(error);
  }
};
