import { Socket } from "socket.io";
import express, { Express, Request, Response } from "express";
import { ClientToServerEvents, ServerToClientEvents } from "../../server";
import {
  getRoomController,
  joinRoomController,
  joinRoomControllerHTTP,
} from "../controllers/room.controller";

export function roomRoutes(app: Express) {
  app.post("/room/join", joinRoomControllerHTTP);

  app.get("/room/:code", getRoomController);
}
