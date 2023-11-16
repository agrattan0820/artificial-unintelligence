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
      <main className="relative">
        <section className="container mx-auto flex min-h-[100dvh] flex-col-reverse items-start justify-center gap-8 px-4 sm:items-center lg:flex-row lg:gap-24">
          {runningGame ? (
            <div className=" absolute left-1/2 top-16 mx-auto w-full -translate-x-1/2 sm:top-8">
              <LinkSecondaryButton
                href={`/room/${runningGame.roomCode}/game/${runningGame.id}`}
                className="mx-auto flex w-full max-w-fit items-center gap-2"
              >
                Join Back Into {runningGame ? "Game" : "Room"} <FiLogIn />
              </LinkSecondaryButton>
            </div>
          ) : (
            <div className="absolute left-1/2 top-16 mx-auto w-full -translate-x-1/2 text-center sm:top-8 lg:hidden">
              <a
                href="https://www.producthunt.com/posts/artificial-unintelligence?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-artificial&#0045;unintelligence"
                target="_blank"
                className="mx-auto flex w-full max-w-fit items-center"
              >
                <img
                  src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=419632&theme=neutral"
                  alt="Artificial&#0032;Unintelligence - Compete&#0032;to&#0032;create&#0032;the&#0032;funniest&#0032;AI&#0032;images&#0032;in&#0032;this&#0032;party&#0032;game | Product Hunt"
                  style={{ width: "250px", height: "54px" }}
                  width="250"
                  height="54"
                />
              </a>
            </div>
          )}
          <div>
            <p className="mb-2">The AI Image Party Game</p>
            <h1 className="mb-8 text-4xl md:text-5xl lg:text-6xl">
              artif<span className="ml-0.5 inline-block">i</span>cial <br />{" "}
              unintelligence
            </h1>
            <SignInForm session={session} submitLabel="Host Game" type="HOME" />
          </div>
          <div className="group relative w-full">
            <Friend className="absolute right-8 w-32 transform transition group-focus-within:-translate-y-16 group-hover:-translate-y-16" />
            <video
              src="/artificial-unintelligence-promo.mp4"
              controls
              autoPlay
              muted
              playsInline
              className="relative aspect-video w-full max-w-md rounded-2xl bg-black shadow-2xl shadow-indigo-500 lg:max-w-full"
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
