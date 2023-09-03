import { Generation, Question, RoomInfo, User, Vote } from "database";

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
  playAnotherGame: () => void;
  serverEvent: (event: StateMachineEvent) => void;
  submittedPlayers: (players: number[]) => void;
  votedPlayers: (votes: { vote: Vote; user: User }[]) => void;
  error: (str: string) => void;
}

export interface ClientToServerEvents {
  connectToRoom: (code: string) => void;
  leaveRoom: (data: { userId: number; code: string }) => void;
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
    userId: number;
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
    player1: number;
    player2: number;
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
