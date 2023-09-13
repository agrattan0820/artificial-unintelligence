import type { Express } from "express";
import {
  createGenerationsController,
  getFaceOffsController,
} from "../controllers/generation.controller";

export function generationRoutes(app: Express) {
  app.get("/generations/gameId/:gameId/round/:round", getFaceOffsController);

  app.post("/generations", createGenerationsController);
}
