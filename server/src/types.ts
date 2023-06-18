import type { EventFrom } from "xstate";
import { RoomInfo } from "../db/schema";
import { serverMachine } from "./server-machine";

export interface ServerToClientEvents {
  hello: (str: string) => void;
  message: (str: string) => void;
  roomState: (roomInfo: RoomInfo) => void;
  startGame: () => void;
  gameEvent: (event: EventFrom<typeof serverMachine>) => void;
  error: (str: string) => void;
}

export interface ClientToServerEvents {
  connectToRoom: (code: string) => void;
  initiateGame: (code: string) => void;
  leaveRoom: (data: { userId: number; code: string }) => void;
}
