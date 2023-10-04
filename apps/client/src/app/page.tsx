import { getServerSession } from "next-auth";
import { FiLogIn } from "react-icons/fi";
import { Game } from "database";

import Footer from "@ai/components/footer";
import Friend from "@ai/components/game/friend";
import SignInForm from "@ai/components/sign-in-form";
import { authOptions } from "@ai/pages/api/auth/[...nextauth]";
import { LinkSecondaryButton } from "@ai/components/button";
import { getRunningGame } from "@ai/utils/server-actions";
import Header from "@ai/components/header";

export default async function Home() {
  const session = await getServerSession(authOptions());

  let runningGame: Game | null = null;

  if (session) {
    const runningGameQuery = await getRunningGame({ session });

    if (runningGameQuery) {
      runningGame = runningGameQuery.game;
    }
  }

  return (
    <>
      <Header session={session} />
      <main className="relative flex min-h-[100dvh] flex-col justify-center">
        <section className="container mx-auto flex flex-col-reverse items-start justify-center gap-8 px-4 lg:flex-row lg:items-center lg:gap-24">
          {runningGame && (
            <div className=" absolute left-1/2 top-16 mx-auto w-full -translate-x-1/2 sm:top-8">
              <LinkSecondaryButton
                href={`/room/${runningGame.roomCode}/game/${runningGame.id}`}
                className="mx-auto flex w-full max-w-fit items-center gap-2"
              >
                Join Back Into {runningGame ? "Game" : "Room"} <FiLogIn />
              </LinkSecondaryButton>
            </div>
          )}
          <div>
            <p className="mb-2">The AI Image Party Game</p>
            <h1 className="mb-8 text-4xl md:text-6xl">
              artif<span className="ml-0.5 inline-block">i</span>cial <br />{" "}
              unintelligence
            </h1>
            <SignInForm session={session} submitLabel="Host Game" type="HOME" />
          </div>
          <Friend className="w-32 scale-x-[-1] transform lg:w-1/4 lg:scale-x-100" />
        </section>
      </main>
      <Footer />
    </>
  );
}
