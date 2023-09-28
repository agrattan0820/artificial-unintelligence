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
} from "@ai/utils/queries";
import {
  gameMachine,
  getCurrentComponent,
} from "@ai/components/game/game-machine";
import { SocketContext } from "@ai/utils/socket-provider";
import { cn } from "@ai/utils/cn";
import type { Session } from "next-auth";
import Menu from "@ai/components/menu";
import useIsMounted from "@ai/utils/hooks/use-is-mounted";

// ! ----------> TYPES <----------

type GameProps = {
  gameInfo: GameInfo;
  session: Session;
};

// ! ----------> COMPONENTS <----------

export default function Game({ gameInfo, session }: GameProps) {
  // Socket for real-time communication
  const socket = useContext(SocketContext);

  const router = useRouter();

  // Wait until the client mounts to avoid hydration errors
  const isMounted = useIsMounted();

  // Id of the user who is the current host of the game
  const [hostId, setHostId] = useState<string | null>(gameInfo.hostId);

  // Store players who have submitted their prompts for a round
  const [submittedPlayerIds, setSubmittedPlayerIds] = useState<Set<string>>(
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
      send(event);
    },
    [send],
  );

  // Update which players have submitted their generations
  const handleOnSubmittedPlayers = (players: string[]) => {
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
    setVotedPlayers(votes);
  };

  // Handle "play another game" request from server
  const handlePlayAnotherGame = useCallback(
    (gameId: number) => {
      send("NEXT");
      router.push(`/room/${gameInfo.game.roomCode}/game/${gameId}`);
    },
    [gameInfo.game.roomCode, router, send],
  );

  // Send new state to server
  useEffect(() => {
    handleStateChange();
  }, [handleStateChange, state]);

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
      session,
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
    session,
  ]);

  return (
    <main
      className={cn(
        !state.matches("leaderboard") &&
          "flex min-h-[100dvh] flex-col justify-center",
      )}
    >
      <section className="container mx-auto px-4 py-24 md:py-16">
        <div className="absolute right-4 top-4 z-50 mt-4 md:right-8 md:top-8">
          <Menu session={session} roomCode={gameInfo.game.roomCode} />
        </div>
        <AnimatePresence mode="wait">
          {isMounted ? currentComponent : null}
        </AnimatePresence>
      </section>
    </main>
  );
}
