import { User, db, users } from "database";
import { eq } from "drizzle-orm";
import { sql } from "drizzle-orm";
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
  const updateCreditAmount = await db
    .update(users)
    .set({ credits: sql`${users.credits} + ${addCredits}` })
    .where(eq(users.email, email))
    .returning();

  return updateCreditAmount[0];
}

export async function deductCreditsFromPlayers({
  players,
}: {
  players: User[];
}) {
  await db.transaction(async (tx) => {
    for (const player of players) {
      await tx
        .update(users)
        .set({ credits: sql`${users.credits} - 1` })
        .where(eq(users.id, player.id));
    }
  });
}
