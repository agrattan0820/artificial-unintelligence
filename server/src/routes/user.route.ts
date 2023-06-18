import { Socket } from "socket.io";
import express, { Express, Request, Response } from "express";
import { ClientToServerEvents, ServerToClientEvents } from "../server";
import {
  createHostController,
  createUserController,
} from "../controllers/user.controller";

export function userRoutes(app: Express) {
  app.post("/user/createHost", createHostController);

  app.post("/user", createUserController);
}
