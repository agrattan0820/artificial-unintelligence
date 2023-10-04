import Stripe from "stripe";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@ai/pages/api/auth/[...nextauth]";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-08-16",
});

export async function POST(req: Request) {
  const origin = new URL(req.url).origin;
  const data: unknown = await req.json();

  const session = await getServerSession(authOptions(req));

  if (!session) {
    return new Response("Must be authenticated", {
      status: 401,
    });
  }

  if (
    !data ||
    typeof data !== "object" ||
    !("priceId" in data) ||
    typeof data?.priceId !== "string"
  ) {
    return new Response("Request body must contain compatible json", {
      status: 400,
    });
  }

  const priceId = data.priceId;

  const checkout = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${origin}/?success=true`,
    cancel_url: `${origin}/?canceled=true`,
    automatic_tax: { enabled: true },
  });

  return NextResponse.json({ url: checkout.url });
}
