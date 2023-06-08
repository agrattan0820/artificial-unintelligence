import { ReactNode } from "react";
import { assign, createMachine } from "xstate";
import ConnectToMainframe from "./connect-to-mainframe";
import ConnectionEstablished from "./connection-established";
import Prompt from "./prompt";
import { motion } from "framer-motion";

const TransitionWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {children}
    </motion.div>
  );
};

export const gameMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QFkCGBjAFgSwHZgDp0B7XfdAFzygBVi08AzAJ1QFswBiAOQFEANGgG0ADAF1EoAA7FY2KqUkgAHogCMAFgAcBDQHYAzAYBsATgCsprQa1bjegDQgAnupHmCIgwCZb3syIa3qZmAL6hTmhYeIQkZGCU2KS8sBSoAEYANtiwmJA8AsLiSjJyCrhKqgiaOvpGZpbWtvZOrggG7gS+vlr+poHBeuGRGDj4BFLMxGxSFJw0AJLIvADKAKoACqISSCCl8kkVu1UAtOYaBGqBeiJWWqYaVnrGrYjaOve9xlrmvhpqxmGICiY0Ik2ms046wAQsgFkUdtJZAdFMdED41AQ9L81N49HorAYHlpXgh3gRPv4fn8AUCQTEJlMZhQVgBXdJseQUfJ8QTbErI8qVdEdAjGbwiLR6AHEgkA0lmHRqe648wiYxXAy-OmjBng5k0bAcWBrKQFPnFXb7IVohAnDQiLG9az1ExqKwaDQKqyXFXeNUarzaiLA3XjfWzAAipC4vIRArKh2F1W0ukMNm05ml+MMpLsjslIhu5gBjzUOui40YGDAAHlGIwoWtYfD+VbBUnbRisTi8QTrMTSaYQp4i2rJRLHt4DBXQQRq+g6w35ktVps20jE6jQKdzpdrrdbA8nuYhyORGOL71AqZp7OGQul4wAGrEblsjlcnmFDd7DvblQRUdcVJQJHwgkMRwXHUd1jAIGxzHzT0DDUNRgxGStCEfetGENY1TXNeN2y3I4d0Qe1HT0Z0jBMN0PS9aDqlg+CfiQjQULQ7x7yrGscIAJTgVlMgoWBCN-a1OzIlNanTKVNFMNDTCo0k1AMIJPF8Y9nhQkJyxDelxgAdzwfBmAAGTAVAIAIuNxP-UjAOktMjDkstLGUxiajg25LHMNSpW8IJzG4whjPiZgxMtTcUQcqoamcol9Co8xzgMFTjC1eDxSzERNHFPR9HCENcGICA4CUAywATGLkxOXE4IlKjfGSwlcVJE5pSxMw8U4kx1VQkKiFIcgqFwWh6FQJhWA4aqbSk3pdH8R4NEaGw7Cgto0IIfoswMbFLAvdVzEBfSw1iYaEnKFI0iyHI8ggWbJMcqUCF2mwaNxO40sY7wAUW4xjCLVT3UQwaIwoR6ALiz14KzAqNUC-xsRJRiHT0TwLBsPoBiUsGmVmPC4FNSHYvI-ENOMOH-FygZvFJXzPGMB1CUQtD2LxiEWXZTkKG5B7iJq20egpHrAvhjKzA2xAGfVZnrFZ1KOeZaN8BJ5NVS6QHbA+4JtdJKiZJMQw1GlW4tUG7CGzV21NAMRaQjU24gixlG2geTFvF+ot2ONq8Ld4htX3fbmv356K5scnqMfuKxPbHLR1RU250eVGO-I1HwtD0jC50t3CjSJqRrakjqdEa50WusNrPOT3007dTPs9DTD5wDxgBNgISROLxzULg8VKc0djtCH09PLxODDGHBP+gvQxBrC0yLKs4mBYjuKTe2+xVLW55DCZlSgm8S5+iJexfqlE6c4ZRewGYHvoY8S+S3sfQmb0fwVOOj4Uv8adgn+OqQamRLJlWYOkYgqBmBhz-CRdW-gxQWH9CEKwQ9sQqQ-h4E2GVlQiECkPE64QgA */
  id: "Machine",
  schema: {
    context: {} as { render: ReactNode; round: number },
    events: {} as { type: "NEXT" } | { type: "TIMESUP" } | { type: "SUBMIT" },
  },
  tsTypes: {} as import("./game-machine.typegen").Typegen0,
  initial: "connectingToMainframe",
  context: {
    render: <div>Hello State Machine!</div>,
    round: 1,
  },
  states: {
    connectingToMainframe: {
      entry: assign(() => ({
        render: (
          <TransitionWrapper key="connectingToMainframe">
            <ConnectToMainframe />
          </TransitionWrapper>
        ),
      })),
      after: {
        5000: "connectionEstablished",
      },
    },

    connectionEstablished: {
      entry: assign(() => ({
        render: (
          <TransitionWrapper key="connectionEstablished">
            <ConnectionEstablished />
          </TransitionWrapper>
        ),
      })),
      after: {
        5000: "prompt",
      },
    },

    prompt: {
      entry: assign(() => ({
        render: (
          <TransitionWrapper key="prompt">
            <Prompt />
          </TransitionWrapper>
        ),
      })),
      on: {
        TIMESUP: "promptTimesUp",
        SUBMIT: "promptSubmitted",
      },
    },

    promptTimesUp: {
      on: {
        NEXT: "promptDone",
      },
    },

    promptSubmitted: {
      on: {
        NEXT: "promptDone",
      },
    },

    promptDone: {
      on: {
        NEXT: "faceOff",
      },
    },

    faceOff: {
      on: {
        SUBMIT: "faceOffVoteSubmitted",
        TIMESUP: "faceOffTimesUp",
      },
    },

    faceOffVoteSubmitted: {
      on: {
        NEXT: "faceOffResults",
      },
    },

    faceOffTimesUp: {
      on: {
        NEXT: "faceOffResults",
      },
    },

    faceOffResults: {
      on: {
        NEXT: "winnerLeadUp",
      },
    },

    winnerLeadUp: {
      on: {
        NEXT: "winner",
      },
    },

    winner: {
      on: {
        NEXT: "leaderboard",
      },
    },

    leaderboard: {},
  },
});
