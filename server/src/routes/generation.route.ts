import type { Express } from "express";
import { getGameRoundGenerationsController } from "../controllers/generation.controller";

export function generationRoutes(app: Express) {
  app.get(
    "/generations/gameId/:gameId/round/:round",
    getGameRoundGenerationsController
  );
}
