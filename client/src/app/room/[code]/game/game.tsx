"use client";

import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { EventFrom, State } from "xstate";
import { useMachine } from "@xstate/react";
import { AnimatePresence } from "framer-motion";

import {
  GetGameInfoResponse,
  QuestionGenerations,
  UserVote,
  getGameRoundGenerations,
  getLeaderboardById,
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

  // Persisted state from server for state machine
  const serverState =
    gameInfo.game.state !== "START_GAME"
      ? gameMachine.resolveState(State.create(JSON.parse(gameInfo.game.state)))
      : undefined;

  // State machine
  const [state, send] = useMachine(gameMachine, {
    state: serverState,
    context: {
      round: serverState ? serverState.context.round : gameInfo.game.round,
      playerCount: gameInfo.room.players.length,
      questionIdx: serverState ? serverState.context.questionIdx : 0,
    },
  });

  console.log("CURR STATE", state);

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
    new Set(gameInfo.submittedPlayers)
  );

  const handleOnSubmittedPlayers = (players: number[]) => {
    console.log("HANDLE SUBMITTED PLAYERS", players);
    setSubmittedPlayerIds(new Set(players));
  };

  console.log("SUBMITTED PLAYER IDS", submittedPlayerIds);

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

  const { data: leaderboard, isLoading: leaderboardLoading } = useQuery(
    ["leaderboard", "gameId", gameId],
    async () => await getLeaderboardById({ gameId }),
    {
      enabled:
        !!gameId && (state.matches("winnerLeadUp") || state.matches("winner")),
    }
  );

  const questionGenerationArr = useMemo(() => {
    return !generationsLoading && generations
      ? Object.values(
          generations.reduce<Record<number, QuestionGenerations>>(
            (acc, curr, i) => {
              if (!acc[curr.question.id]) {
                acc[curr.question.id] = {
                  question: curr.question,
                  player1:
                    curr.generation.userId === curr.question.player1
                      ? curr.user
                      : generations[i + 1].user,
                  player1Generation:
                    curr.generation.userId === curr.question.player1
                      ? curr.generation
                      : generations[i + 1].generation, // the generations are ordered by question id so instead of doing a search for the correct generation, we know that it is at the next index
                  player2:
                    curr.generation.userId === curr.question.player2
                      ? curr.user
                      : generations[i + 1].user,
                  player2Generation:
                    curr.generation.userId === curr.question.player2
                      ? curr.generation
                      : generations[i + 1].generation,
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
      ? questionGenerationArr[state.context.questionIdx]
      : undefined;

  console.log("CURR FaceOff QUESTION", currFaceOffQuestion);

  // Store players who have submitted votes for the current question
  const [votedPlayers, setVotedPlayers] = useState<UserVote[]>(
    gameInfo.votedPlayers
  );

  const handleVotedPlayers = (votes: UserVote[]) => {
    console.log("HANDLE VOTED PLAYERS", votes);
    setVotedPlayers(votes);
  };

  // Socket.io Effects
  useEffect(() => {
    socket.on("serverEvent", handleServerEvent);
    socket.on("submittedPlayers", handleOnSubmittedPlayers);
    socket.on("votedPlayers", handleVotedPlayers);

    return () => {
      socket.off("serverEvent", handleServerEvent);
      socket.off("submittedPlayers", handleOnSubmittedPlayers);
      socket.off("votedPlayers", handleVotedPlayers);
    };
  }, [handleServerEvent, socket]);

  // Testing Socket.io Event Handler
  const handleTestEvent = () => {
    socket.emit("testEvent", gameInfo.room.code);
  };

  // Game component shown based off state
  // TODO: test transforming this into a React component
  const currentComponent = useMemo(() => {
    return getCurrentComponent(
      gameInfo,
      state,
      send,
      submittedPlayerIds,
      currFaceOffQuestion,
      votedPlayers,
      leaderboard
    );
  }, [
    gameInfo,
    state,
    send,
    submittedPlayerIds,
    currFaceOffQuestion,
    votedPlayers,
    leaderboard,
  ]);

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
