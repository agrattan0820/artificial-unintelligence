// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "xstate.after(10000)#Machine.winner": {
      type: "xstate.after(10000)#Machine.winner";
    };
    "xstate.after(20000)#Machine.faceOffResults": {
      type: "xstate.after(20000)#Machine.faceOffResults";
    };
    "xstate.after(4000)#Machine.nextRound": {
      type: "xstate.after(4000)#Machine.nextRound";
    };
    "xstate.after(5000)#Machine.connectingToMainframe": {
      type: "xstate.after(5000)#Machine.connectingToMainframe";
    };
    "xstate.after(5000)#Machine.connectionEstablished": {
      type: "xstate.after(5000)#Machine.connectionEstablished";
    };
    "xstate.after(5000)#Machine.promptDone": {
      type: "xstate.after(5000)#Machine.promptDone";
    };
    "xstate.after(5000)#Machine.winnerLeadUp": {
      type: "xstate.after(5000)#Machine.winnerLeadUp";
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
  eventsCausingActions: {
    incrementQuestionIdx: "xstate.after(20000)#Machine.faceOffResults";
    startNewRound: "xstate.after(20000)#Machine.faceOffResults";
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {
    completedCurrentRound: "xstate.after(20000)#Machine.faceOffResults";
    completedRounds: "xstate.after(20000)#Machine.faceOffResults";
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
