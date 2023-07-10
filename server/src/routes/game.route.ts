import type { Express } from "express";
import {
  getGameWinnerByIdController,
  getLatestGameByRoomCodeController,
} from "../controllers/game.controller";

export function gameRoutes(app: Express) {
  app.get("/game/:code", getLatestGameByRoomCodeController);
  app.get("/game/:id/winner", getGameWinnerByIdController);
}
