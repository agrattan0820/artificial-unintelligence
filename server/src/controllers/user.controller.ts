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

export const createHostControllerTwo = async (req: Request, res: Response) => {
  const body = req.body;

  console.log("BODY", body);

  res.status(200).json("Received");
};
