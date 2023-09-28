import { db, users } from "database";
import { eq } from "drizzle-orm";
import { stripe } from "../stripe";

export async function createCheckoutSession({
  email,
  priceId,
}: {
  email: string;
  priceId: string;
}) {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    customer_email: email,
    mode: "payment",
    success_url: `${process.env.APP_URL}/pricing?success=true`,
    cancel_url: `${process.env.APP_URL}/pricing?canceled=true`,
    automatic_tax: { enabled: true },
  });

  return session;
}

export async function increaseUserCreditAmount({
  addCredits,
  email,
}: {
  addCredits: number;
  email: string;
}) {
  const currCreditAmount = await db
    .select({
      credits: users.credits,
    })
    .from(users)
    .where(eq(users.email, email));

  if (!currCreditAmount[0]) {
    throw new Error("User could not be found when increasing credit amount");
  }

  const amountToAdd = currCreditAmount[0].credits ?? 0;

  const updateCreditAmount = await db
    .update(users)
    .set({ credits: addCredits + amountToAdd })
    .where(eq(users.email, email))
    .returning();

  return updateCreditAmount[0];
}
