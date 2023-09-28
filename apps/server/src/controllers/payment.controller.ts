import type { NextFunction, Request, Response } from "express";
import type Stripe from "stripe";

import {
  createCheckoutSession,
  increaseUserCreditAmount,
} from "../services/payment.service";
import { stripe } from "../stripe";

export async function paymentController(
  req: Request<{}, {}, { email: string; priceId: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const email = req.body.email;
    const priceId = req.body.priceId;

    if (!email || !priceId) {
      res.status(400).send({ error: `Body must include email and priceId` });
      return;
    }

    const checkoutSession = await createCheckoutSession({ email, priceId });

    res.status(200).send(checkoutSession);
  } catch (error) {
    next(error);
  }
}

const fulfillOrder = (
  lineItems: Stripe.ApiList<Stripe.LineItem> | undefined
) => {
  // TODO: fill me in
  console.log("Fulfilling order", lineItems);
};

const endpointSecret =
  "whsec_97726b3392e302b9229b20ac5d7c196f1ee22249dd1665a6ef750aeb7e1ced5d";

export async function paymentWebhookController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const sig = req.headers["stripe-signature"];

    if (!sig) {
      res.status(400).send(`No stripe-signature header value was provided`);
      return;
    }

    const event = stripe.webhooks.constructEvent(
      req.body,
      sig as string,
      endpointSecret
    );

    console.log("[STRIPE EVENT]", event);

    // Handle the checkout.session.completed event
    if (
      event.type === "checkout.session.completed" &&
      "id" in event.data.object &&
      typeof event.data.object.id === "string"
    ) {
      // Retrieve the session. If you require line items in the response, you may include them by expanding line_items.
      const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
        event.data.object.id,
        {
          expand: ["line_items"],
        }
      );
      const lineItems = sessionWithLineItems.line_items;

      // Fulfill the purchase...
      fulfillOrder(lineItems);

      if (!sessionWithLineItems.customer_email) {
        throw new Error("Customer email was not attached to payment");
      }

      const userWithCredits = await increaseUserCreditAmount({
        email: sessionWithLineItems.customer_email,
        addCredits: 1,
      });

      console.log("[USER WITH CREDITS]", userWithCredits);
    }

    res.status(200).end();
  } catch (error) {
    next(error);
  }
}
