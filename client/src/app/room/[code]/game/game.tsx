"use client";

import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { EventFrom, State } from "xstate";
import { useMachine } from "@xstate/react";
import { AnimatePresence } from "framer-motion";

import {
  GetGameInfoResponse,
  QuestionGenerations,
  getGameRoundGenerations,
} from "@ai/app/server-actions";
import Button from "@ai/components/button";
import {
  gameMachine,
  getCurrentComponent,
} from "@ai/components/game/game-machine";
import { SocketContext } from "@ai/utils/socket-provider";
import { useQuery } from "@tanstack/react-query";

// ! ----------> TYPES <----------

type GameProps = {
  roomCode: string;
  gameInfo: GetGameInfoResponse;
};

// ! ----------> COMPONENTS <----------

export default function Game({ roomCode, gameInfo }: GameProps) {
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
  const [submittedPlayerIds, setSubmittedPlayerIds] = useState<Set<number>>(
    new Set([])
  );

  const handleOnSubmittedPlayers = (players: number[]) => {
    console.log("HANDLE SUBMITTED PLAYERS", players);
    setSubmittedPlayerIds(new Set(players));
  };

  // Track the current question in the face-off
  const [faceOffQuestionIdx, setFaceOffQuestionIdx] = useState(0);

  // Construct Question Generation map for face-offs
  const gameId = gameInfo.game.id;
  const round = state.context.round;
  const { data: generations, isLoading: generationsLoading } = useQuery(
    ["generations", "gameId", gameId, "round", round],
    async () => await getGameRoundGenerations({ gameId, round }),
    {
      enabled:
        !!gameId &&
        !!round &&
        (state.matches("faceOff") || state.matches("faceOffResults")),
    }
  );

  const questionGenerationArr = useMemo(() => {
    return !generationsLoading && generations
      ? Object.values(
          generations.reduce<Record<number, QuestionGenerations>>(
            (acc, curr, i) => {
              if (!acc[curr.questions.id]) {
                acc[curr.questions.id] = {
                  question: curr.questions,
                  player1Generation:
                    curr.generations.userId === curr.questions.player1
                      ? curr.generations
                      : generations[i + 1].generations, // the generations are ordered by question id so instead of doing a search for the correct generation, we know that it is at the next index
                  player2Generation:
                    curr.generations.userId === curr.questions.player2
                      ? curr.generations
                      : generations[i + 1].generations,
                };
              }

              return acc;
            },
            {}
          )
        )
      : [];
  }, [generations, generationsLoading]);

  console.log("QUESTION GENERATIONS", questionGenerationArr);

  const currFaceOffQuestion =
    questionGenerationArr.length > 0
      ? questionGenerationArr[faceOffQuestionIdx]
      : undefined;

  console.log("CURR FaceOff QUESTION", currFaceOffQuestion);

  // Socket.io Effects
  useEffect(() => {
    socket.on("serverEvent", handleServerEvent);
    socket.on("submittedPlayers", handleOnSubmittedPlayers);

    return () => {
      socket.off("serverEvent", handleServerEvent);
      socket.off("submittedPlayers", handleOnSubmittedPlayers);
    };
  }, [handleServerEvent, socket]);

  // Testing Socket.io Event Handler
  const handleTestEvent = () => {
    socket.emit("testEvent", gameInfo.room.code);
  };

  // Game component shown based off state
  const currentComponent = useMemo(() => {
    return getCurrentComponent(
      gameInfo,
      state,
      send,
      submittedPlayerIds,
      currFaceOffQuestion
    );
  }, [gameInfo, state, send, submittedPlayerIds, currFaceOffQuestion]);

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
