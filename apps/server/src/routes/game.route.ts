import type { Express } from "express";
import {
  getLeaderboardByIdController,
  getGameInfoController,
} from "../controllers/game.controller";

export function gameRoutes(app: Express) {
  app.get("/game/:code", getGameInfoController);
  app.get("/game/:id/leaderboard", getLeaderboardByIdController);
}
