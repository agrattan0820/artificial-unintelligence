import { type Express } from "express";
import { paymentController } from "../controllers/payment.controller";

export function paymentRoutes(app: Express) {
  app.post("/payment", paymentController);

  // Webhook would be here but we need to parse the webhook as `raw` rather than with json so we specify it before the json middl
}
