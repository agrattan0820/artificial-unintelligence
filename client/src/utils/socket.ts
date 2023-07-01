import type { EventFrom } from "xstate";
import { Socket, io } from "socket.io-client";

import { RoomInfo } from "@ai/app/server-actions";
import { gameMachine } from "@ai/components/game/game-machine";

export interface ServerToClientEvents {
  message: (str: string) => void;
  roomState: (roomInfo: RoomInfo) => void;
  startGame: () => void;
  serverEvent: (event: EventFrom<typeof gameMachine>) => void;
  error: (str: string) => void;
}

export interface ClientToServerEvents {
  connectToRoom: (code: string) => void;
  initiateGame: (code: string) => void;
  clientEvent: (data: { state: string; gameId: number; round: number }) => void;
  generationSubmitted: (data: {
    gameId: number;
    round: number;
    userId: number;
    questionId: number;
    text: string;
    imageUrl: string;
  }) => void;
  voteSubmitted: (data: {
    userId: number;
    generationId: number;
    gameId: number;
    questionId: number;
  }) => void;
  leaveRoom: (code: string) => void;
}

export const URL =
  process.env.NODE_ENV === "production"
    ? "http://localhost:8080" // TODO: change to API_URL
    : "http://localhost:8080";

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  URL,
  {
    autoConnect: false,
  }
);
