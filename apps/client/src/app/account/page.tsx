import AccountContent from "@ai/components/account-content";
import Footer from "@ai/components/footer";
import Header from "@ai/components/header";
import { authOptions } from "@ai/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Account() {
  const session = await getServerSession(authOptions());

  if (!session) {
    redirect("/");
  }

  return (
    <>
      <Header session={session} />
      <main className="relative flex min-h-[100dvh] flex-col justify-center">
        <AccountContent session={session} />
      </main>
      <Footer />
    </>
  );
}
