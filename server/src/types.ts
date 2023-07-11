import type { EventFrom } from "xstate";
import { RoomInfo, User, Vote } from "../db/schema";
import { serverMachine } from "./server-machine";

export interface ServerToClientEvents {
  message: (str: string) => void;
  roomState: (roomInfo: RoomInfo) => void;
  startGame: () => void;
  serverEvent: (event: EventFrom<typeof serverMachine>) => void;
  submittedPlayers: (players: number[]) => void;
  votedPlayers: (votes: { vote: Vote; user: User }[]) => void;
  error: (str: string) => void;
}

export interface ClientToServerEvents {
  connectToRoom: (code: string) => void;
  initiateGame: (code: string) => void;
  clientEvent: (data: { state: string; gameId: number; round: number }) => void;
  testEvent: (code: string) => void;
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
  leaveRoom: (data: { userId: number; code: string }) => void;
}

export type UserVote = { vote: Vote; user: User };
