import type { Express } from "express";
import {
  getRoomController,
  joinRoomController,
} from "../controllers/room.controller";
import { getQuestionByIdController } from "../controllers/question.controller";

export function questionRoutes(app: Express) {
  app.get("/question/:id", getQuestionByIdController);
}
