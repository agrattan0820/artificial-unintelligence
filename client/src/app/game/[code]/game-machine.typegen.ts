// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "xstate.after(30000)#Machine.faceOff": {
      type: "xstate.after(30000)#Machine.faceOff";
    };
    "xstate.after(5000)#Machine.connectingToMainframe": {
      type: "xstate.after(5000)#Machine.connectingToMainframe";
    };
    "xstate.after(5000)#Machine.connectionEstablished": {
      type: "xstate.after(5000)#Machine.connectionEstablished";
    };
    "xstate.after(5000)#Machine.nextRound": {
      type: "xstate.after(5000)#Machine.nextRound";
    };
    "xstate.after(5000)#Machine.promptTimesUp": {
      type: "xstate.after(5000)#Machine.promptTimesUp";
    };
    "xstate.after(90000)#Machine.prompt": {
      type: "xstate.after(90000)#Machine.prompt";
    };
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
  eventsCausingGuards: {
    completedRounds: "NEXT";
  };
  eventsCausingServices: {};
  matchesStates:
    | "connectingToMainframe"
    | "connectionEstablished"
    | "faceOff"
    | "faceOffResults"
    | "faceOffTimesUp"
    | "faceOffVoteSubmitted"
    | "leaderboard"
    | "nextRound"
    | "prompt"
    | "promptDone"
    | "promptSubmitted"
    | "promptTimesUp"
    | "winner"
    | "winnerLeadUp";
  tags: never;
}
