import type { Express } from "express";
import {
  getLeaderboardByIdController,
  getPageGameInfoByRoomCodeController,
  getUserRegenerationCountController,
  incrementUserRegenerationCountController,
} from "../controllers/game.controller";

export function gameRoutes(app: Express) {
  app.get("/game/:code", getPageGameInfoByRoomCodeController);
  app.get("/game/:id/leaderboard", getLeaderboardByIdController);
  app.get(
    "/game/:id/regenerations/:userId",
    getUserRegenerationCountController
  );

  app.post(
    "/game/:id/regenerations/:userId",
    incrementUserRegenerationCountController
  );
}
