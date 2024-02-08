import { getServerSession } from "next-auth/next";
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
      <main className="relative">
        <section className="container mx-auto flex flex-col-reverse items-start justify-center gap-8 px-4 pb-16 pt-32 sm:items-center lg:min-h-screen lg:flex-row lg:gap-24 lg:pb-0 lg:pt-0">
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
          <div className="w-full max-w-sm lg:max-w-full">
            <p className="mb-2">The AI Image Party Game</p>
            <h1 className="mb-8 text-4xl md:text-5xl lg:text-6xl">
              Artif<span className="ml-0.5 inline-block">i</span>cial <br />{" "}
              Unintelligence
            </h1>
            <SignInForm session={session} submitLabel="Host Game" type="HOME" />
          </div>
          <div className="group relative w-full">
            <Friend
              className="absolute right-8 w-32 transform transition group-focus-within:-translate-y-16 group-hover:-translate-y-16"
              type="SMILING"
            />
            <video
              src="/artificial-unintelligence-promo.mp4"
              controls
              autoPlay
              muted
              playsInline
              className="relative mx-auto aspect-video w-full rounded-2xl bg-black shadow-2xl shadow-indigo-500 lg:max-w-full"
            ></video>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
