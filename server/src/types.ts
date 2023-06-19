import type { EventFrom } from "xstate";
import { RoomInfo } from "../db/schema";
import { serverMachine } from "./server-machine";

export interface ServerToClientEvents {
  message: (str: string) => void;
  roomState: (roomInfo: RoomInfo) => void;
  startGame: () => void;
  serverEvent: (event: EventFrom<typeof serverMachine>) => void;
  error: (str: string) => void;
}

export interface ClientToServerEvents {
  connectToRoom: (code: string) => void;
  initiateGame: (code: string) => void;
  clientEvent: (data: { state: string; gameId: number; round: number }) => void;
  generationSubmitted: (data: { gameId: number; round: number }) => void;
  voteSubmitted: (data: { gameId: number; questionId: number }) => void;
  leaveRoom: (data: { userId: number; code: string }) => void;
}
