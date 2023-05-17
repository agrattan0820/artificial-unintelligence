import { Socket } from "socket.io";
import express, { Express, Request, Response } from "express";
import { ClientToServerEvents, ServerToClientEvents } from "../../server";
import {
  createHostController,
  createHostControllerTwo,
  createUserController,
} from "../controllers/user.controller";

export function userRoutes(
  app: Express,
  socket: Socket<ClientToServerEvents, ServerToClientEvents>
) {
  socket.on("createHost", createHostController);

  app.post("/user/createHost", createHostControllerTwo);

  app.post("/user", createUserController);
}
