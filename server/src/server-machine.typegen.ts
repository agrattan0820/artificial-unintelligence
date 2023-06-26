// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "xstate.after(30000)#Server Machine.faceOff": {
      type: "xstate.after(30000)#Server Machine.faceOff";
    };
    "xstate.after(4000)#Server Machine.nextRound": {
      type: "xstate.after(4000)#Server Machine.nextRound";
    };
    "xstate.after(5000)#Server Machine.connectingToMainframe": {
      type: "xstate.after(5000)#Server Machine.connectingToMainframe";
    };
    "xstate.after(5000)#Server Machine.connectionEstablished": {
      type: "xstate.after(5000)#Server Machine.connectionEstablished";
    };
    "xstate.after(5000)#Server Machine.promptDone": {
      type: "xstate.after(5000)#Server Machine.promptDone";
    };
    "xstate.after(5000)#Server Machine.promptTimesUp": {
      type: "xstate.after(5000)#Server Machine.promptTimesUp";
    };
    "xstate.after(5000)#Server Machine.startGame": {
      type: "xstate.after(5000)#Server Machine.startGame";
    };
    "xstate.after(5000)#Server Machine.winnerLeadUp": {
      type: "xstate.after(5000)#Server Machine.winnerLeadUp";
    };
    "xstate.after(90000)#Server Machine.prompt": {
      type: "xstate.after(90000)#Server Machine.prompt";
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
    sendNextToClient:
      | "xstate.after(5000)#Server Machine.connectingToMainframe"
      | "xstate.after(5000)#Server Machine.connectionEstablished"
      | "xstate.after(5000)#Server Machine.startGame";
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
    | "promptTimesUp"
    | "startGame"
    | "winner"
    | "winnerLeadUp";
  tags: never;
}
