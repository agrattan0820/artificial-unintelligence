"use client";

import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { EventFrom, State } from "xstate";
import { useMachine } from "@xstate/react";
import { AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import {
  GameInfo,
  QuestionGenerations,
  RoomInfo,
  UserVote,
  getGameRoundGenerations,
  getLeaderboardById,
} from "@ai/app/server-actions";
import {
  gameMachine,
  getCurrentComponent,
} from "@ai/components/game/game-machine";
import { SocketContext } from "@ai/utils/socket-provider";
import { useStore } from "@ai/utils/store";

// ! ----------> TYPES <----------

type GameProps = {
  roomCode: string;
  gameInfo: GameInfo;
};

// ! ----------> COMPONENTS <----------

export default function Game({ roomCode, gameInfo }: GameProps) {
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
    new Set(gameInfo.submittedPlayers)
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
    socket.emit("clientEvent", {
      state: JSON.stringify(state),
      gameId: gameInfo.game.id,
      round: state.context.round,
      completedAt: state.matches("leaderboard")
        ? new Date().toISOString()
        : undefined,
    });
  }, [gameInfo.game.id, socket, state]);

  useEffect(() => {
    handleStateChange();
  }, [handleStateChange, state]);

  // Receive state changes from server
  const handleServerEvent = useCallback(
    (event: EventFrom<typeof gameMachine>) => {
      console.log("[RECEIVED EVENT]", event);
      send(event);
    },
    [send]
  );

  const handleOnSubmittedPlayers = (players: number[]) => {
    console.log("[HANDLE SUBMITTED PLAYERS]", players);
    setSubmittedPlayerIds(new Set(players));
  };

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

  const currFaceOffQuestion =
    questionGenerationArr.length > 0
      ? questionGenerationArr[state.context.questionIdx]
      : undefined;

  // Store players who have submitted votes for the current question
  const [votedPlayers, setVotedPlayers] = useState<UserVote[]>(
    gameInfo.votedPlayers
  );

  const handleVotedPlayers = (votes: UserVote[]) => {
    console.log("[HANDLE VOTED PLAYERS]", votes);
    setVotedPlayers(votes);
  };

  // Handle play another game request from server
  // Refresh page to acquire new server-rendered `gameInfo`
  const handlePlayAnotherGame = useCallback(() => {
    router.refresh();
  }, [router]);

  // set gameId state
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
      leaderboard
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

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <main className="flex min-h-[100dvh] flex-col justify-center">
      <section className="container mx-auto px-4">
        <AnimatePresence mode="wait">
          {isMounted ? currentComponent : null}
        </AnimatePresence>
      </section>
    </main>
  );
}
