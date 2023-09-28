import CreditsAmount from "@ai/components/credits-amount";
import Footer from "@ai/components/footer";
import Menu from "@ai/components/menu";
import PricingPay from "@ai/components/pricing-pay";
import { authOptions } from "@ai/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";

export default async function Pricing() {
  const session = await getServerSession(authOptions());

  return (
    <main className="relative flex min-h-[100dvh] flex-col justify-center">
      {session && (
        <div className="absolute right-4 top-4 z-50 mt-4 flex gap-4 md:right-8 md:top-8">
          <CreditsAmount creditCount={session.user.credits} />
          <Menu session={session} />
        </div>
      )}
      <section className="container mx-auto px-4 pb-16 text-center">
        <h2 className="mb-8 text-3xl">Pricing</h2>
        <div className="mx-auto flex h-80 w-80 flex-col items-center justify-center rounded-xl bg-gradient-to-r from-slate-700 to-slate-800 shadow filter transition duration-300 hover:brightness-110">
          <p className="mb-2 text-5xl">$1.99</p>
          <p className="mb-8">1 Token</p>
          {session && session.user.email && (
            <PricingPay email={session.user.email} />
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
