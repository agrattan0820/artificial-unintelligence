import express, { Express, Request, Response } from "express";

import { ClientToServerEvents } from "../../server";
import { createRoom } from "../services/room.service";
import { createUser } from "../services/user.service";

export const createHostController: ClientToServerEvents["createHost"] = async (
  data,
  callback
) => {
  const newUser = await createUser(data);
  console.log("[CREATE USER]:", newUser);

  const newRoom = await createRoom({ host: newUser });
  console.log("[CREATE ROOM]:", newRoom);

  callback({ host: newUser, room: newRoom });
};

export const createHostControllerTwo = async (
  req: Request<{}, {}, { nickname: string }>,
  res: Response
) => {
  const body = req.body;

  const newUser = await createUser(body);
  console.log("[CREATE USER]:", newUser);

  const newRoom = await createRoom({ host: newUser });
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
