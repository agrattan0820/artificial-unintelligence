import type { Generation, Question, RoomInfo, User, Vote } from "database";

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
  startGame: (gameId: number) => void;
  playAnotherGame: (gameId: number) => void;
  serverEvent: (event: StateMachineEvent) => void;
  submittedPlayers: (players: string[]) => void;
  votedPlayers: (votes: { vote: Vote; user: User }[]) => void;
  error: (str: string) => void;
}

export interface ClientToServerEvents {
  connectToRoom: (data: { code: string; userId: string }) => void;
  leaveRoom: (data: { userId: string; code: string }) => void;
  initiateGame: (code: string) => void;
  initiatePlayAnotherGame: (code: string) => void;
  clientEvent: (data: {
    state: string;
    gameId: number;
    round: number;
    completedAt?: string;
  }) => void;
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
}

export type UserVote = { vote: Vote; user: User };

export type GameRoundGeneration = {
  generation: Generation;
  question: {
    id: number;
    text: string;
    round: number;
    gameId: number;
    player1: string;
    player2: string;
    createdAt: Date;
  };
  user: User;
};

export type QuestionGenerations = {
  question: Question;
  player1: User;
  player1Generation: Generation;
  player2: User;
  player2Generation: Generation;
};
