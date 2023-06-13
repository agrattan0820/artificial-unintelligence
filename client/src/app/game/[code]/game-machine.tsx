import { ReactNode } from "react";
import { assign, createMachine } from "xstate";
import ConnectToMainframe from "./connect-to-mainframe";
import ConnectionEstablished from "./connection-established";
import Prompt from "./prompt";
import { motion } from "framer-motion";
import AnnouncementText from "./announcement-text";
import PromptSubmitted from "./prompt-submitted";
import FaceOff from "./face-off";
import FaceOffResult from "./face-off-result";
import WinnerLeadUp from "./winner-lead-up";
import Winner from "./winner";
import Leaderboard from "./leaderboard";
import NextRound from "./next-round";

// COMPONENTS

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

// TYPES

type MachineContext = {
  render: ReactNode;
  round: number;
};
type MachineEvent = { type: "NEXT" } | { type: "SUBMIT" } | { type: "MORE" };

// GUARDS

const completedRounds = (context: MachineContext, event: MachineEvent) => {
  return context.round === 3;
};

// MACHINE

export const gameMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QFkCGBjAFgSwHZgDp0B7XfdAFzygBVi08AzAJ1QFswBiAD1gtQqFUjQcwAUAVgAMMgJSc0WPIRJkwlanQa4W7MAG0pAXUSgADsVjYqpUyG6IAjABYAbAQDsjqQA4PEnx8AJmcpDxCAGhAATydXCQIATh8AZmdnNJSpFOSPAF88qMUcfCJSchtcAFE+VAAjABtsWExIHlrBAmFRSRkpeWLlMrUNUhr+RubWiEMTJBALK0q7BwQXdy9ff0CQsKCPKNiEZ28CCXjnRI9fEIkCoowSwjNmYjYzCk4AZQBVACFkABJGizOyLazYWzzVYpIKJJK+FIpRw+KSJRGJVyHRASDzw0KuZxBRywxIpPGOe4gQalF5vD7tfidbpgcTovoDR5DOnvCig+bg5bQxAAWmcHgIjlc4XSsPOaX8EmxCACUiSjlxiUS518ZKCVJpz1evJo2A4sB+ZkZAiEIlZvTkCi5tONH1N5st-PMlghUNAqykyqkBudRvpFC+AFc6mxrIIIJwAHJVAAaIOMYJ9Qv9iCRPk8HmurhSrnRQVcPkxyo8gQIpfChZ8rkcWtSIaULvDABFSFxeEzbT1pI7DQQeR8e-gvQss5DcCtEIGYov208CIwMGAAPKMRjff5A9Nzb1LOcLhCkhGpZGo9GpKvLta+dwSDXxEvE5wSCTOVdDDfoNuu7WsydriFkHJOh2hAAUBjDToKZ7CggYobIkQRBBIJbIl4LbOMq3i1lImFSG4jhwq4+wpH+pSwTujAAEpwJGDQULASapkemann69iIB47iUUixbOH45aYfhj4uMEkopPKsIZBkZI0TBm70UxsAsWxHFpvojjHjOPHzshjj+AQH4BKZaIpIED5HBqWoEMELgKa4pZSip65qbuGlaexyBbgxVQIbOvGrBqzhOUExGWU2WonEEBEohKXgBD4KKiVIbm-oU1KhgQ+DcBQDHEJGuAJsmukZgKoXGTmKqwgQUgtnJFZSNIEjasqP7uBkNkhF4mLRXcuWjgA7ng+DMAAMmAqAQJaOlcTVRnniKjWUW55YSJh36lk2BGURKmHodkxYyNcI0PNBBATWozBLSFq0mecdZwriYTJc1mEEaiCQZYpqRYZSVK4MQEBwHYhrcb6dV8ShjhSk51zkgpiQnNIjjKiKfh1v4xFhNqLZhFdeU3aoFSaPQqBMKwHAw9m8PomcwQeG47WlnsBxSf96RE4j6TfsR+qjflFPqJU4z1E0LSQAzSH1dqngUWiTaUejpnKuWkXkkW30uBdpOjuOFDy2FTjluZuL44EoS3Fjj7SPmUrEj4lxsy4HhyZ5JvunAlpm3DqwihWyPZF7IQa5jyoVgkuIYa+DmI2zPuuhG0axhQ8aB+eFFJNeQR+LisLNkqj6x2c4SYYjnXJzl11ribk5gDnJlIgQJxeEEWQ2WiiOJY+fiOAQuyUZ15wYSSnl0burf1Rqw8BAENneJc+xl-Z2TD+E6H7KZBL12Ta4z4xzGsfAK2w+e5GRTWe9u1+0glliUklsdokkuSzVndRos3YVxVSrlTnvDd2TlmzoniGSZI0oX72W-JFKUD8EHtS8J5O6U1ZrzQDpfRmwdiyyULg2ZE2popuwIjtf6xF-BwnLPFI2+UMGshAeFH8TVYTXDdpWZq4QCJeAlN4aSaQl47RBg3IYDQ5oQ2YHUYgqBmAQBYU4NITlXx818JWDUXsCLoQlHJRI5EfzpHFD4AoBQgA */
    id: "Machine",
    schema: {
      context: {} as MachineContext,
      events: {} as MachineEvent,
    },
    tsTypes: {} as import("./game-machine.typegen").Typegen0,
    initial: "connectingToMainframe",
    predictableActionArguments: true,
    context: {
      render: <div>Hello State Machine!</div>,
      round: 1,
    },
    states: {
      connectingToMainframe: {
        // TODO: pass in context and event into components?
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
          SUBMIT: "promptSubmitted",
        },
        after: {
          90000: "promptTimesUp",
        },
      },

      promptTimesUp: {
        entry: assign(() => ({
          render: (
            <TransitionWrapper key="promptTimesUp">
              <AnnouncementText text="Time's Up!" />
            </TransitionWrapper>
          ),
        })),
        after: {
          5000: "faceOff",
        },
      },

      promptSubmitted: {
        entry: assign(() => ({
          render: (
            <TransitionWrapper key="promptSubmitted">
              <PromptSubmitted />
            </TransitionWrapper>
          ),
        })),
        on: {
          NEXT: "promptDone",
        },
      },

      promptDone: {
        entry: assign(() => ({
          render: (
            <TransitionWrapper key="promptDone">
              <AnnouncementText text="All Participants Have Submitted!" />
            </TransitionWrapper>
          ),
        })),
        after: {
          5000: "faceOff",
        },
      },

      faceOff: {
        entry: assign(() => ({
          render: (
            <TransitionWrapper key="faceOff">
              <FaceOff />
            </TransitionWrapper>
          ),
        })),
        on: {
          SUBMIT: "faceOffResults",
        },
        after: {
          30000: "faceOffResults",
        },
      },

      faceOffResults: {
        entry: assign(() => ({
          render: (
            <TransitionWrapper key="faceOffResults">
              <FaceOffResult />
            </TransitionWrapper>
          ),
        })),
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
          render: (
            <TransitionWrapper key="nextRound">
              <NextRound nextQueryNum={context.round + 1} totalQueries={3} />
            </TransitionWrapper>
          ),
        })),
        after: {
          4000: "prompt",
        },
      },

      winnerLeadUp: {
        entry: assign(() => ({
          render: (
            <TransitionWrapper key="winnerLeadUp">
              <WinnerLeadUp />
            </TransitionWrapper>
          ),
        })),
        after: {
          5000: "winner",
        },
      },

      winner: {
        entry: assign(() => ({
          render: (
            <TransitionWrapper key="winner">
              <Winner />
            </TransitionWrapper>
          ),
        })),
        on: {
          NEXT: "leaderboard",
        },
      },

      leaderboard: {
        entry: assign(() => ({
          render: (
            <TransitionWrapper key="leaderboard">
              <Leaderboard />
            </TransitionWrapper>
          ),
        })),
      },
    },
  },
  {
    guards: {
      completedRounds,
    },
  }
);
