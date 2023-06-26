import type { Express } from "express";
import { getLatestGameByRoomCodeController } from "../controllers/game.controller";

export function gameRoutes(app: Express) {
  app.get("/game/:code", getLatestGameByRoomCodeController);
}
