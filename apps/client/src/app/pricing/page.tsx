import Footer from "@ai/components/footer";
import Header from "@ai/components/header";
import PricingPay from "@ai/components/pricing-pay";
import { authOptions } from "@ai/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";

export default async function Pricing() {
  const session = await getServerSession(authOptions());

  return (
    <>
      <Header session={session} />
      <main className="relative flex min-h-[100dvh] flex-col justify-center">
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
      </main>
      <Footer />
    </>
  );
}
