import type { Express } from "express";
import {
  deleteUserController,
  existingHostController,
} from "../controllers/user.controller";

export function userRoutes(app: Express) {
  app.post("/user/existingHost", existingHostController);
  app.delete("/user/:id", deleteUserController);
}
