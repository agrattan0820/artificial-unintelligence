import express, { Express, NextFunction, Request, Response } from "express";

import { ClientToServerEvents, ServerToClientEvents } from "../../server";
import { createRoom, joinRoom } from "../services/room.service";
import { createUser } from "../services/user.service";
import { Socket } from "socket.io";

export const createHostController = async (
  req: Request<{}, {}, { nickname: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = req.body;

    const newUser = await createUser(body);

    const newRoom = await createRoom();

    const hostInRoom = await joinRoom({
      userId: newUser.id,
      code: newRoom.code,
    });

    res.status(200).json({ host: newUser, room: newRoom });
  } catch (error) {
    next(error);
  }
};

export const createUserController = async (
  req: Request<{}, {}, { nickname: string }>,
  res: Response
) => {
  const body = req.body;

  const newUser = await createUser(body);
  console.log("[CREATE USER]:", newUser);

  res.status(200).json({ user: newUser });
};
