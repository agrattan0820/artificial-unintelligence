import { Socket } from "socket.io";
import express, { Express, Request, Response } from "express";
import { createRoom, getRoomInfo, joinRoom } from "../services/room.service";
import { ClientToServerEvents, ServerToClientEvents } from "../../server";
import {
  acceptRoomInviteController,
  joinRoomController,
} from "../controllers/room.controller";

export function roomRoutes(
  app: Express,
  socket: Socket<ClientToServerEvents, ServerToClientEvents>
) {
  socket.on("joinRoom", joinRoomController);

  app.get("/room/invite/:code", acceptRoomInviteController);
}
