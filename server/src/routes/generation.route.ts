import type { Express } from "express";
import { getFaceOffsController } from "../controllers/generation.controller";

export function generationRoutes(app: Express) {
  app.get("/generations/gameId/:gameId/round/:round", getFaceOffsController);
}
