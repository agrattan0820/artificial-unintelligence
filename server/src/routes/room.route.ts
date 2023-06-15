import { Socket } from "socket.io";
import express, { Express, Request, Response } from "express";
import { ClientToServerEvents, ServerToClientEvents } from "../../server";
import {
  getRoomController,
  joinRoomController,
} from "../controllers/room.controller";

export function roomRoutes(app: Express) {
  app.post("/room/join", joinRoomController);

  app.get("/room/:code", getRoomController);
}
