import { Socket } from "socket.io";
import { assign, createMachine } from "xstate";
import { ClientToServerEvents, ServerToClientEvents } from "./types";

// TYPES
type MachineContext = {
  socket: Socket<ClientToServerEvents, ServerToClientEvents> | null;
  round: number;
};
type MachineEvent = { type: "NEXT" } | { type: "SUBMIT" } | { type: "MORE" };

// MACHINE
export const serverMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QGUwCcBu6AEBZAhgMYAWAlgHZgB0sALvmrQOL4C2YAxAB5363X4AZvzQAKAKwAGaQEoOqTDgIkK1XoxbsA2pIC6iUAAcA9rFK1Sx8gZBdEkgDQgAnvYC+bpwqxo8RMpRUhFaUhBbkUAAqxgQUgmhsnDz0-FRCIhLSknLeSv6qQSFgYRRRMfhxCdp6NiZmFlY2dggATADsAMxUAIwAnAAcbQBs7eId3UMDTq6tkm1U4gAs3e2LbYuLLYv9HR5e6D5+KoHB5KEN5ACivABGADaksMSQ3Lyp6eiZsvIHecfUp3OliutweT0gOn0SBAdXMwKaiCGknEVA64m6kn6yyRknGvWmiG6-W6VBaO36Q0W4n64na3UWu08IFyvmUAWohjQxlYhlo8gAqgAhXAASUikNqpjhjWhzQpkioFJa4jaGKWi2RQwJCH6LSoQ26fRpkl6Qw6vTaLV6e2Zv1Z+UCnO5vNeKQEwk+vSy2R+int-yoTp5tAl0NhFwROqRipGKrVG012pauNR1ONybRHUk7RtLKO7MDXODkVI7Fg-MMrr47oyUm+ebZBSDvJLZYroaMUojssJaKGpI6w26bQGw7a46TKbR-XTuLG2baubt+abRd5yAArjdWOZ+BAOAA5S4ADXFNTDXfhPYQhv6Cr7HW2mLaM-xLkQuv1hoGUlN5st1pMg2DocmutAACJWEkbw1p8dY+sBAbNhBUEdjCl4yqAzTdFIJKah0-QDL0-4dNqWI9N+8o7NILQtEMS5+iugSCEQYAAPKCIIArCmKaHhleWGEus8zEiqOwquIFrasOvRUAybS0nMhqqi0aIMYcjbMaxHFcck1ZpB6YhZlkOTLpp1AsYQ7GcXxGHWNew5rIqOEvmiClSe+N7jFQprKjhLTdOaiy9IF6l-AWlnWYIABKcAbnctCwIeJ5nlCnb1AJtiIMmyz6kMYlWgRDIjNJdELIsQyDGsmLSLeYX+hF2mcbFsDxYlyWnlo3RpehGWYVlsy5UM+UvoVWIdCVnkyXJ1ITcRFUEbR9FAWZIFUJFOktW1SW4Gx0WXLZfX2YJN7jnq6Kvisc4hW0ZEktsClzOsVrueI9VMdQlBcLQ0XGBu5D7np7yGaIGr1qtAZfT9f0A4d0rHQNAXEnJZIdMqkhrIMWLamjepInGDJbMiOzveZVAAO4UJQaAADJgPgEAVlWwO1iZvoaWtlNnOgdMM+257pfDkZbJSCxjI+knTnMpX9FQGOVQpkwVZIBqLKTnNU+gHWpZKR3C5M90miMdH5Y+9Klf2SwK9Vd6SHVNrkMYEBwDYiHsrrQvXgAtNs2pe4M+rrKO7ReneQyLitjFk+ozCJB73YnY4nnLLL+OqoTGqzerAaAsU4RlLE5DxHHF569emzasRPnDBj4zGxsBrZwWuclFY1z0PcjzPBA8eZc05oosM4j5cFkxYqppGeVXFpIgyEy0Q33RN6uzq0L3-XNJ0smqQpw+TJVduTzM0813P9cVUvkcc0hYGtnAFbrwj2FEvew+PneWOEZOeqPr02wzuMABgF9hRzWshTc25dyQEfpGXoVdBxSGGF6IicCyJdAxHRLYqpAriGpMtEB18CzIUgpQGBDk+wDiHCOYk44JyeR2D0bMKoFwESWH-ZeWkrI6TISdeeixUR+VwX-NotdK6vxcn-IkRoxgcIsk1GKcUErwFLp7XhgxZIFRfH0c0RJpIdC6FSLMcCNRPiJLIqgUNfr-R7iohOiMswokCuOJhuJdRvhmESFEYwVgWlquiSq5iubU15ozQwPD7HIh6IOER6NFruMJO0OWg4qQDBpFSQYLRAmazQOE5oyoA66gCpRGcdCPGJNxApekuNeiSQUuYu49NnZoBuMYBgNjBZ2LySOfh6ZfxegxN0Uq8wKnokJlaWpb0PBuCAA */
    id: "Server Machine",
    schema: {
      context: {} as MachineContext,
      events: {} as MachineEvent,
    },
    context: {
      socket: null,
      round: 1,
    },
    tsTypes: {} as import("./server-machine.typegen").Typegen0,
    initial: "connectingToMainframe",
    predictableActionArguments: true,
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
        entry: assign((context, event) => ({
          round: context.round + 1,
        })),
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

      leaderboard: {
        type: "final",
      },
    },
  },
  {
    guards: {
      completedRounds: (context, event) => {
        return context.round === 3;
      },
    },
  }
);
