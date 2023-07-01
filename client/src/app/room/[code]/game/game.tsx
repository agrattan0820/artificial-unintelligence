"use client";

import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { EventFrom, State } from "xstate";
import { useMachine } from "@xstate/react";
import { AnimatePresence } from "framer-motion";

import {
  GameInfo,
  GetGameInfoResponse,
  getGameInfo,
} from "@ai/app/server-actions";
import Button from "@ai/components/button";
import {
  gameMachine,
  getCurrentComponent,
} from "@ai/components/game/game-machine";
import { SocketContext } from "@ai/utils/socket-provider";

export default function Game({
  roomCode,
  gameInfo,
}: {
  roomCode: string;
  gameInfo: GetGameInfoResponse;
}) {
  // const { data: gameInfo, refetch: refetchGameInfo } = useQuery(
  //   ["gameInfo", initialGameInfo.game.id],
  //   async () => await getGameInfo(roomCode),
  //   {
  //     initialData: initialGameInfo,
  //   }
  // );

  // Socket for real-time communication
  const socket = useContext(SocketContext);

  // State machine
  const [state, send] = useMachine(gameMachine, {
    state:
      gameInfo.game.state !== "START_GAME"
        ? gameMachine.resolveState(
            State.create(JSON.parse(gameInfo.game.state))
          )
        : gameMachine.initialState,
    context: {
      round: gameInfo.game.round,
    },
  });

  // Send updated state to server
  const handleStateChange = useCallback(() => {
    socket.emit("clientEvent", {
      state: JSON.stringify(state),
      gameId: gameInfo.game.id,
      round: state.context.round,
    });
  }, [gameInfo.game.id, socket, state]);

  useEffect(() => {
    handleStateChange();
  }, [handleStateChange, state]);

  // Receive state changes from server
  const handleServerEvent = useCallback(
    (event: EventFrom<typeof gameMachine>) => {
      console.log("RECEIVED EVENT", event);
      send(event);
    },
    [send]
  );

  // Store players who have submitted their prompts for a round
  const [submittedPlayers, setSubmittedPlayers] = useState<Set<number>>(
    new Set([])
  );

  const handleOnSubmittedPlayers = (players: number[]) => {
    console.log("HANDLE SUBMITTED PLAYERS", players);
    setSubmittedPlayers(new Set(players));
  };

  useEffect(() => {
    socket.on("serverEvent", handleServerEvent);
    socket.on("submittedPlayers", handleOnSubmittedPlayers);

    return () => {
      socket.off("serverEvent", handleServerEvent);
      socket.off("submittedPlayers", handleOnSubmittedPlayers);
    };
  }, [handleServerEvent, socket]);

  const handleTestEvent = () => {
    socket.emit("testEvent", gameInfo.room.code);
  };

  // Game component shown based off state
  const currentComponent = useMemo(() => {
    return getCurrentComponent(gameInfo, state, send, submittedPlayers);
  }, [gameInfo, send, state, submittedPlayers]);

  return (
    <main className="flex min-h-screen flex-col justify-center">
      <section className="container mx-auto px-4">
        <AnimatePresence mode="wait">{currentComponent}</AnimatePresence>
      </section>
      <div className="fixed bottom-8 right-8 flex gap-2">
        <Button onClick={handleTestEvent}>Test Event</Button>
        <Button onClick={() => send("NEXT")}>Next</Button>
        <Button onClick={() => send("SUBMIT")}>Submit</Button>
        <Button onClick={() => send("MORE")}>More</Button>
      </div>
    </main>
  );
}
