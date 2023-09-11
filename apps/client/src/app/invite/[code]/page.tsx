import { getServerSession } from "next-auth";

import { getRoomInfo } from "@ai/app/server-actions";
import Footer from "@ai/components/footer";
import Friend from "@ai/components/game/friend";
import SignInForm from "@ai/components/sign-in-form";
import { authOptions } from "@ai/pages/api/auth/[...nextauth]";

export default async function Invite({ params }: { params: { code: string } }) {
  const roomInfo = await getRoomInfo(params.code);

  const session = await getServerSession(authOptions());

  return (
    <main className="flex min-h-[100dvh] flex-col justify-center">
      <section className="container mx-auto flex flex-col-reverse items-start justify-center gap-8 px-4 lg:flex-row lg:gap-24">
        <div>
          <h1 className="mb-8 text-4xl md:text-6xl">
            artif<span className="ml-0.5 inline-block">i</span>cial <br />{" "}
            unintelligence
          </h1>
          <SignInForm
            session={session}
            room={roomInfo}
            submitLabel="Join Game"
            type="INVITE"
          />
        </div>
        <Friend className="w-32 lg:w-1/4" />
      </section>
      <Footer />
    </main>
  );
}
