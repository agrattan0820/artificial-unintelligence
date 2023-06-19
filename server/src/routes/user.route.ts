import type { Express } from "express";
import {
  createHostController,
  createUserController,
} from "../controllers/user.controller";

export function userRoutes(app: Express) {
  app.post("/user/createHost", createHostController);

  app.post("/user", createUserController);
}
