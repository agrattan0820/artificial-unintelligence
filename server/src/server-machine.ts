import { assign, createMachine } from "xstate";

// TYPES

type MachineContext = {};
type MachineEvent = { type: "NEXT" } | { type: "SUBMIT" } | { type: "MORE" };

// GUARDS

// MACHINE

export const serverMachine = createMachine(
  {
    id: "Server Machine",
    schema: {
      context: {} as MachineContext,
      events: {} as MachineEvent,
    },
    tsTypes: {} as import("./server-machine.typegen").Typegen0,
    initial: "connectingToMainframe",
    predictableActionArguments: true,
    context: {},
    states: {
      connectingToMainframe: {
        after: {
          5000: "connectionEstablished",
        },
      },

      connectionEstablished: {
        after: {
          5000: "prompt",
        },
      },

      prompt: {
        on: {
          SUBMIT: "promptSubmitted",
        },
        after: {
          90000: "promptTimesUp",
        },
      },

      promptTimesUp: {
        after: {
          5000: "faceOff",
        },
      },

      promptSubmitted: {
        on: {
          NEXT: "promptDone",
        },
      },

      promptDone: {
        after: {
          5000: "faceOff",
        },
      },

      faceOff: {
        on: {
          SUBMIT: "faceOffResults",
        },
        after: {
          30000: "faceOffResults",
        },
      },

      faceOffResults: {
        on: {
          NEXT: [
            {
              target: "winnerLeadUp",
              cond: "completedRounds",
            },
            {
              target: "nextRound",
            },
          ],
          MORE: "faceOff",
        },
      },

      nextRound: {
        after: {
          4000: "prompt",
        },
      },

      winnerLeadUp: {
        after: {
          5000: "winner",
        },
      },

      winner: {
        on: {
          NEXT: "leaderboard",
        },
      },

      leaderboard: {},
    },
  },
  {
    guards: {},
  }
);
