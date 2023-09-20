import { getServerSession } from "next-auth";
import { FiLogIn } from "react-icons/fi";
import { Game } from "database";

import { getRoomInfo } from "@ai/utils/queries";
import Footer from "@ai/components/footer";
import Friend from "@ai/components/game/friend";
import SignInForm from "@ai/components/sign-in-form";
import { authOptions } from "@ai/pages/api/auth/[...nextauth]";
import Menu from "@ai/components/menu";
import { LinkSecondaryButton } from "@ai/components/button";
import { getRunningGame } from "@ai/utils/server-actions";

export default async function Invite({ params }: { params: { code: string } }) {
  const roomInfo = await getRoomInfo(params.code);

  const session = await getServerSession(authOptions());

  let runningGame: Game | null = null;

  if (session) {
    const runningGameQuery = await getRunningGame({ session });

    if (runningGameQuery) {
      runningGame = runningGameQuery.game;
    }
  }

  return (
    <main className="flex min-h-[100dvh] flex-col justify-center">
      {session && (
        <div className="absolute right-4 top-4 z-50 mt-4 md:right-8 md:top-8">
          <Menu session={session} />
        </div>
      )}
      <section className="container mx-auto flex flex-col-reverse items-start justify-center gap-8 px-4 lg:flex-row lg:gap-24">
        {runningGame && (
          <div className="absolute left-1/2 top-8 w-full -translate-x-1/2">
            <LinkSecondaryButton
              href={`/room/${runningGame.roomCode}/game/${runningGame.id}`}
              className="mx-auto flex w-full max-w-fit items-center gap-2"
            >
              Join Back Into {runningGame ? "Game" : "Room"} <FiLogIn />
            </LinkSecondaryButton>
          </div>
        )}
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
