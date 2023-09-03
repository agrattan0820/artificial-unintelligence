import type { Express } from "express";
import {
  createHostController,
  createUserController,
  existingHostController,
} from "../controllers/user.controller";

export function userRoutes(app: Express) {
  app.post("/user", createUserController);
  app.post("/user/createHost", createHostController);
  app.post("/user/existingHost", existingHostController);
}
