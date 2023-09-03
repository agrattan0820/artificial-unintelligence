import type { Express } from "express";
import {
  getQuestionByIdController,
  getQuestionsByUserGameRoundController,
} from "../controllers/question.controller";

export function questionRoutes(app: Express) {
  app.get("/question/:id", getQuestionByIdController);
  app.get(
    "/questions/user/:userId/game/:gameId/round/:round",
    getQuestionsByUserGameRoundController
  );
}
