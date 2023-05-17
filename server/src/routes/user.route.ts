import { Socket } from "socket.io";
import express, { Express, Request, Response } from "express";
import { ClientToServerEvents, ServerToClientEvents } from "../../server";
import {
  createHostController,
  createUserController,
} from "../controllers/user.controller";

export function userRoutes(
  app: Express,
  socket: Socket<ClientToServerEvents, ServerToClientEvents>
) {
  app.post("/user/createHost", (req: Request, res: Response) =>
    createHostController(req, res, socket)
  );

  app.post("/user", createUserController);
}
