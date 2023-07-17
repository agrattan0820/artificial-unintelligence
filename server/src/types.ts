import { RoomInfo, User, Vote } from "../db/schema";

type StateMachineEvent =
  | {
      type: "NEXT";
    }
  | {
      type: "SUBMIT";
    }
  | {
      type: "MORE";
    };
export interface ServerToClientEvents {
  message: (str: string) => void;
  roomState: (roomInfo: RoomInfo) => void;
  startGame: () => void;
  serverEvent: (event: StateMachineEvent) => void;
  submittedPlayers: (players: number[]) => void;
  votedPlayers: (votes: { vote: Vote; user: User }[]) => void;
  error: (str: string) => void;
}

export interface ClientToServerEvents {
  connectToRoom: (code: string) => void;
  leaveRoom: (data: { userId: number; code: string }) => void;
  initiateGame: (code: string) => void;
  playAnotherGame: (gameId: number) => void;
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
}

export type UserVote = { vote: Vote; user: User };
