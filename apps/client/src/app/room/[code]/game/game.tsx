"use client";

import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { EventFrom, State } from "xstate";
import { useMachine } from "@xstate/react";
import { AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import {
  GameInfo,
  RoomInfo,
  UserVote,
  getFaceOffs,
  getLeaderboardById,
} from "@ai/app/server-actions";
import {
  gameMachine,
  getCurrentComponent,
} from "@ai/components/game/game-machine";
import { SocketContext } from "@ai/utils/socket-provider";
import { useStore } from "@ai/utils/store";
import { cn } from "@ai/utils/cn";

// ! ----------> TYPES <----------

type GameProps = {
  gameInfo: GameInfo;
};

// ! ----------> COMPONENTS <----------

export default function Game({ gameInfo }: GameProps) {
  // Socket for real-time communication
  const socket = useContext(SocketContext);

  // Next.js router
  const router = useRouter();

  // game id store state
  const { setGameId } = useStore();

  // Wait until the client mounts to avoid hydration errors
  const [isMounted, setIsMounted] = useState(false);

  // Id of the user who is the current host of the game
  const [hostId, setHostId] = useState<number | null>(gameInfo.hostId);

  // Store players who have submitted their prompts for a round
  const [submittedPlayerIds, setSubmittedPlayerIds] = useState<Set<number>>(
    new Set(gameInfo.submittedPlayers),
  );

  // Store players who have submitted votes for the current question
  const [votedPlayers, setVotedPlayers] = useState<UserVote[]>(
    gameInfo.votedPlayers,
  );

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
      playerCount: gameInfo.players.length,
      questionIdx: serverState ? serverState.context.questionIdx : 0,
    },
  });

  const handleRoomState = (roomInfo: RoomInfo) => {
    console.log("[ROOM INFO]", roomInfo);
    setHostId(roomInfo.hostId);
  };

  // Send updated state to server
  const handleStateChange = useCallback(() => {
    // Don't send state change to backend if it is a `promptSubmitted` state
    if (!state.matches("promptSubmitted")) {
      socket.emit("clientEvent", {
        state: JSON.stringify(state),
        gameId: gameInfo.game.id,
        round: state.context.round,
        completedAt: state.matches("leaderboard")
          ? new Date().toISOString()
          : undefined,
      });
    }
  }, [gameInfo.game.id, socket, state]);

  // Receive state changes from server
  const handleServerEvent = useCallback(
    (event: EventFrom<typeof gameMachine>) => {
      console.log("[RECEIVED EVENT]", event);
      send(event);
    },
    [send],
  );

  // Update which players have submitted their generations
  const handleOnSubmittedPlayers = (players: number[]) => {
    console.log("[HANDLE SUBMITTED PLAYERS]", players);
    setSubmittedPlayerIds(new Set(players));
  };

  const gameId = gameInfo.game.id;
  const round = state.context.round;
  const { data: faceOffs, isLoading: faceOffsLoading } = useQuery(
    ["faceOffs", "gameId", gameId, "round", round],
    () => getFaceOffs({ gameId, round }),
    {
      enabled:
        !!gameId &&
        !!round &&
        (state.matches("faceOff") || state.matches("faceOffResults")),
    },
  );
  const { data: leaderboard } = useQuery(
    ["leaderboard", "gameId", gameId],
    () => getLeaderboardById({ gameId }),
    {
      enabled:
        !!gameId &&
        (state.matches("winnerLeadUp") ||
          state.matches("winner") ||
          state.matches("leaderboard")),
    },
  );

  const currFaceOffQuestion =
    !faceOffsLoading && faceOffs && faceOffs.length > 0
      ? faceOffs[state.context.questionIdx]
      : undefined;

  // Update which players have voted for the current face off
  const handleVotedPlayers = (votes: UserVote[]) => {
    console.log("[HANDLE VOTED PLAYERS]", votes);
    setVotedPlayers(votes);
  };

  // Handle "play another game" request from server
  // Refresh page to acquire new server-rendered `gameInfo`
  const handlePlayAnotherGame = useCallback(() => {
    send("NEXT");
    router.refresh();
  }, [router, send]);

  // Send new state to server
  useEffect(() => {
    handleStateChange();
  }, [handleStateChange, state]);

  // Set gameId state
  useEffect(() => {
    setGameId(gameId);
  }, [gameId, setGameId]);

  // Socket.io Effects
  useEffect(() => {
    socket.on("roomState", handleRoomState);
    socket.on("serverEvent", handleServerEvent);
    socket.on("submittedPlayers", handleOnSubmittedPlayers);
    socket.on("votedPlayers", handleVotedPlayers);
    socket.on("playAnotherGame", handlePlayAnotherGame);

    return () => {
      socket.off("roomState", handleRoomState);
      socket.off("serverEvent", handleServerEvent);
      socket.off("submittedPlayers", handleOnSubmittedPlayers);
      socket.off("votedPlayers", handleVotedPlayers);
      socket.off("playAnotherGame", handlePlayAnotherGame);
    };
  }, [handlePlayAnotherGame, handleServerEvent, socket]);

  // Game component shown based off state
  const currentComponent = useMemo(() => {
    return getCurrentComponent(
      gameInfo,
      state,
      send,
      hostId,
      submittedPlayerIds,
      currFaceOffQuestion,
      votedPlayers,
      leaderboard,
    );
  }, [
    gameInfo,
    state,
    send,
    hostId,
    submittedPlayerIds,
    currFaceOffQuestion,
    votedPlayers,
    leaderboard,
  ]);

  // Avoid hydration issues by ensuring app has mounted
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <main
      className={cn(
        !state.matches("leaderboard") &&
          "flex min-h-[100dvh] flex-col justify-center",
      )}
    >
      <section className="container mx-auto px-4 py-16">
        <AnimatePresence mode="wait">
          {isMounted ? currentComponent : null}
        </AnimatePresence>
      </section>
    </main>
  );
}
