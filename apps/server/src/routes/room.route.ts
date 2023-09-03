import type { Express } from "express";
import {
  getRoomController,
  joinRoomController,
} from "../controllers/room.controller";

export function roomRoutes(app: Express) {
  app.get("/room/:code", getRoomController);

  app.post("/room/join", joinRoomController);
}
