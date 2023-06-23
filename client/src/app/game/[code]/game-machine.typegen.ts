// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {
    incrementRound: "NEXT";
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {
    completedRounds: "NEXT";
  };
  eventsCausingServices: {};
  matchesStates:
    | "connectingToMainframe"
    | "connectionEstablished"
    | "faceOff"
    | "faceOffResults"
    | "leaderboard"
    | "nextRound"
    | "prompt"
    | "promptDone"
    | "promptSubmitted"
    | "winner"
    | "winnerLeadUp";
  tags: never;
}
