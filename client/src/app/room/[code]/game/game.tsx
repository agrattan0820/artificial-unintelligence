"use client";

import {
  gameMachine,
  getCurrentComponent,
} from "@ai/app/game/[code]/game-machine";
import { GameInfo, GetGameInfoResponse } from "@ai/app/server-actions";
import Button from "@ai/components/button";
import { SocketContext } from "@ai/utils/socket-provider";
import { useStore } from "@ai/utils/store";
import { useMachine } from "@xstate/react";
import { AnimatePresence } from "framer-motion";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { EventFrom, State } from "xstate";

export default function Game({ gameInfo }: { gameInfo: GetGameInfoResponse }) {
  const { user } = useStore();
  const [state, send] = useMachine(gameMachine);
  const socket = useContext(SocketContext);
  const currentComponent = useMemo(() => {
    return getCurrentComponent(state);
  }, [state]);

  // const handleStateChange = useCallback(() => {
  //   socket.emit("clientEvent", {
  //     state: JSON.stringify(state),
  //     gameId: gameInfo.game.id,
  //     round: state.context.round,
  //   });
  // }, [gameInfo.game.id, socket, state]);

  const handleServerEvent = useCallback(
    (event: EventFrom<typeof gameMachine>) => {
      console.log("RECEIVED EVENT", event);
      send(event);
    },
    [send]
  );

  // useEffect(() => {
  //   handleStateChange();
  // }, [handleStateChange, state]);

  useEffect(() => {
    socket.on("serverEvent", handleServerEvent);

    return () => {
      socket.off("serverEvent", handleServerEvent);
    };
  }, [handleServerEvent, socket]);

  return (
    <main className="flex min-h-screen flex-col justify-center">
      <section className="container mx-auto px-4">
        <AnimatePresence mode="wait">{currentComponent}</AnimatePresence>
      </section>
      <div className="fixed bottom-8 right-8 flex gap-2">
        {/* <Button onClick={() => send("NEXT")}>Next</Button>
        <Button onClick={() => send("SUBMIT")}>Submit</Button>
        <Button onClick={() => send("MORE")}>More</Button> */}
      </div>
    </main>
  );
}
