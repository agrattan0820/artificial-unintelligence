import type { Session } from "next-auth";
import type { Game } from "database";
import type { RoomInfo } from "@ai/utils/queries";

import { LinkSecondaryButton } from "./button";
import { FiLogIn } from "react-icons/fi";
import SignInForm from "./sign-in-form";
import Header from "./header";
import Friend from "./game/friend";
import Footer from "./footer";

export default function HomepageTemplate({
  session,
  roomInfo,
  runningGame,
  formLabel,
  type,
}: {
  session: Session | null;
  roomInfo?: RoomInfo;
  runningGame: Game | null;
  formLabel: string;
  type: "HOME" | "INVITE";
}) {
  return (
    <>
      <Header session={session} />
      <main className="relative">
        <section className="container mx-auto flex flex-col-reverse items-start justify-center gap-8 px-4 pb-16 pt-32 sm:items-center lg:min-h-[100dvh] lg:flex-row lg:gap-24 lg:pb-0 lg:pt-0">
          {runningGame && (
            <div className="absolute left-1/2 top-16 w-full -translate-x-1/2 sm:top-8">
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
            <h1 className="mb-8 text-4xl md:text-6xl">
              Artif<span className="ml-0.5 inline-block">i</span>cial <br />{" "}
              Unintelligence
            </h1>
            <SignInForm
              session={session}
              room={type === "INVITE" && roomInfo ? roomInfo : undefined}
              submitLabel={formLabel}
              type={type}
            />
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
