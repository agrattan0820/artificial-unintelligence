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
  eventsCausingActions: {};
  eventsCausingDelays: {};
  eventsCausingGuards: {};
  eventsCausingServices: {};
  matchesStates:
    | "connectingToMainframe"
    | "connectionEstablished"
    | "faceOff"
    | "faceOffResults"
    | "faceOffTimesUp"
    | "faceOffVoteSubmitted"
    | "leaderboard"
    | "prompt"
    | "promptDone"
    | "promptSubmitted"
    | "promptTimesUp"
    | "winner"
    | "winnerLeadUp";
  tags: never;
}
