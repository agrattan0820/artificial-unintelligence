"use client";

import { gameMachine } from "@ai/app/game/[code]/game-machine";
import Button from "@ai/components/button";
import { SocketContext } from "@ai/utils/socket-provider";
import { useStore } from "@ai/utils/store";
import { useMachine } from "@xstate/react";
import { AnimatePresence } from "framer-motion";
import { useCallback, useContext, useEffect } from "react";
import { EventFrom } from "xstate";

export default function Game({ params }: { params: { code: string } }) {
  const { user } = useStore();
  const [state, send] = useMachine(gameMachine);
  const socket = useContext(SocketContext);

  const handleGameEvent = useCallback(
    (event: EventFrom<typeof gameMachine>) => {
      console.log("RECEIVED EVENT", event);
      send(event);
    },
    [send]
  );

  useEffect(() => {
    socket.on("gameEvent", handleGameEvent);

    return () => {
      socket.off("gameEvent", handleGameEvent);
    };
  }, [handleGameEvent, socket]);

  return (
    <main className="flex min-h-screen flex-col justify-center">
      <section className="container mx-auto px-4">
        <AnimatePresence mode="wait">{state.context.render}</AnimatePresence>
      </section>
      <div className="fixed bottom-8 right-8 flex gap-2">
        <Button onClick={() => send("NEXT")}>Next</Button>
        <Button onClick={() => send("SUBMIT")}>Submit</Button>
        <Button onClick={() => send("MORE")}>More</Button>
      </div>
    </main>
  );
}
