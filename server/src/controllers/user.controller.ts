import express, { Express, Request, Response } from "express";

import { ClientToServerEvents, ServerToClientEvents } from "../../server";
import { createRoom } from "../services/room.service";
import { createUser } from "../services/user.service";
import { Socket } from "socket.io";

export const createHostController = async (
  req: Request<{}, {}, { nickname: string }>,
  res: Response
) => {
  const body = req.body;

  console.log("BODY", body);

  const newUser = await createUser(body);
  console.log("[CREATE USER]:", newUser);

  const newRoom = await createRoom();
  console.log("[CREATE ROOM]:", newRoom);

  res.status(200).json({ host: newUser, room: newRoom });
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
