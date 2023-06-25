import type { Express } from "express";
import {
  createQuestionController,
  getQuestionByIdController,
} from "../controllers/question.controller";

export function questionRoutes(app: Express) {
  app.get("/question/:id", getQuestionByIdController);

  app.post("/question", createQuestionController);
}
