import type { Express } from "express";
import {
  getLeaderboardByIdController,
  getLatestGameByRoomCodeController,
} from "../controllers/game.controller";

export function gameRoutes(app: Express) {
  app.get("/game/:code", getLatestGameByRoomCodeController);
  app.get("/game/:id/leaderboard", getLeaderboardByIdController);
}
