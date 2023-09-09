import type { EventFrom } from "xstate";
import { Socket, io } from "socket.io-client";

import { RoomInfo, UserVote } from "@ai/app/server-actions";
import { gameMachine } from "@ai/components/game/game-machine";

export interface ServerToClientEvents {
  message: (str: string) => void;
  roomState: (roomInfo: RoomInfo) => void;
  startGame: (gameId: number) => void;
  playAnotherGame: () => void;
  serverEvent: (event: EventFrom<typeof gameMachine>) => void;
  submittedPlayers: (players: string[]) => void;
  votedPlayers: (votes: UserVote[]) => void;
  error: (str: string) => void;
}

export interface ClientToServerEvents {
  connectToRoom: (data: { code: string; userId: string }) => void;
  initiateGame: (code: string) => void;
  clientEvent: (data: {
    state: string;
    gameId: number;
    round: number;
    completedAt?: string;
  }) => void;
  initiatePlayAnotherGame: (code: string) => void;
  testEvent: (code: string) => void;
  generationSubmitted: (data: {
    generationId: number;
    gameId: number;
    round: number;
  }) => void;
  voteSubmitted: (data: {
    userId: string;
    generationId: number;
    gameId: number;
    questionId: number;
  }) => void;
  leaveRoom: (data: { userId: string; code: string }) => void;
}

export const URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  URL,
  {
    autoConnect: false,
  },
);
