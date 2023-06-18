import { gameMachine } from "@ai/app/game/[code]/game-machine";
import { RoomInfo } from "@ai/app/server-actions";
import { Socket, io } from "socket.io-client";
import type { EventFrom } from "xstate";

export interface ServerToClientEvents {
  hello: (str: string) => void;
  message: (str: string) => void;
  roomState: (roomInfo: RoomInfo) => void;
  startGame: () => void;
  gameEvent: (event: EventFrom<typeof gameMachine>) => void;
  error: (str: string) => void;
}

export interface ClientToServerEvents {
  connectToRoom: (code: string) => void;
  initiateGame: (code: string) => void;
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
