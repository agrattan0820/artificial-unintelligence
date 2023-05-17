import { Socket } from "socket.io";
import express, { Express, Request, Response } from "express";
import { ClientToServerEvents, ServerToClientEvents } from "../../server";
import {
  getRoomController,
  joinRoomController,
} from "../controllers/room.controller";

export function roomRoutes(
  app: Express,
  socket: Socket<ClientToServerEvents, ServerToClientEvents>
) {
  socket.on("joinRoom", async (data, callback) =>
    joinRoomController(data, callback, socket)
  );

  app.get("/room/:code", getRoomController);
}
