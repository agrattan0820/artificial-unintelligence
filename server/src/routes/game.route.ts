import type { Express } from "express";
import {
  getLeaderboardByIdController,
  getPageGameInfoByRoomCodeController,
} from "../controllers/game.controller";

export function gameRoutes(app: Express) {
  app.get("/game/:code", getPageGameInfoByRoomCodeController);
  app.get("/game/:id/leaderboard", getLeaderboardByIdController);
}
