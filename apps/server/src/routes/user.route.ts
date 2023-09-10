import type { Express } from "express";
import { existingHostController } from "../controllers/user.controller";

export function userRoutes(app: Express) {
  app.post("/user/existingHost", existingHostController);
}
