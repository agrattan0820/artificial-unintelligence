"use client";

import { useMachine } from "@xstate/react";
import AnnouncementText from "./announcement-text";
import FaceOff from "./face-off";
import Leaderboard from "./leaderboard";
import NextRound from "./next-round";
import Prompt from "./prompt";
import RoundResult from "./round-result";
import Timer from "./timer";
import View from "./view";
import Winner from "./winner";
import WinnerLeadUp from "./winner-lead-up";
import WinnerWithImage from "./winner-with-image";
import { gameMachine } from "./game-machine";
import Button from "@ai/components/button";
import { AnimatePresence } from "framer-motion";
import PromptSubmitted from "./prompt-submitted";

export default function Game({ params }: { params: { code: string } }) {
  const [state, send] = useMachine(gameMachine);

  return (
    <main className="flex min-h-screen flex-col justify-center">
      <section className="container mx-auto px-4">
        <PromptSubmitted />
        {/* <AnimatePresence mode="wait">{state.context.render}</AnimatePresence> */}
      </section>
      <div className="fixed bottom-8 right-8">
        <Button onClick={() => send("NEXT")}>Next</Button>
      </div>
    </main>
  );
}
