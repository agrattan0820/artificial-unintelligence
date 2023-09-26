import { stripe } from "../stripe";

export async function createCheckoutSession({ priceId }: { priceId: string }) {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.APP_URL}?success=true`,
    cancel_url: `${process.env.APP_URL}?canceled=true`,
    automatic_tax: { enabled: true },
  });

  console.log(session);

  return session;
}
