import { ReactNode } from "react";
import { assign, createMachine } from "xstate";
import ConnectToMainframe from "./connect-to-mainframe";
import ConnectionEstablished from "./connection-established";
import Prompt from "./prompt";
import { motion } from "framer-motion";
import AnnouncementText from "./announcement-text";

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
    /** @xstate-layout N4IgpgJg5mDOIC5QFkCGBjAFgSwHZgDp0B7XfdAFzygBVi08AzAJ1QFswBiAD1gtQqFUjQcwAUAVgAMMgJSc0WPIRJkwlanQa4W7MAG0pAXUSgADsVjYqpUyG6IAjABYAbAQDsjqQA4PEnx8AJmcpDxCAGhAATydXCQIATh8AZmdnNJSpFOSPAF88qMUcfCJSchtcAFE+VAAjABtsWExIHlrBAmFRSRkpeWLlMrUNUhr+RubWiEMTJBALK0q7BwQXdy9ff0CQsKCPKNiEZ28CCXjnRI9fEIkCoowSwjNmYjYzCk4AZQBVACFkABJGizOyLazYWzzVYpIKJJK+FIpRw+KSJRGJVyHRASDzw0KuZxBRywxIpPGOe4gQalF5vD7tfidbpgcTovoDR5DOnvCig+bg5bQxAAWmcHgIjlc4XSsPOaX8EmxCACUiSjlxiUS518ZKCVJpz1evJo2A4sB+Zk4ADkqgANEHGMGWCFQ0CrEWwgiuIKuH1kiRwrKuFJKmKIDyBb1XfaR1yOLWpA1c2nGj5fACudTY1kEEBt9sdc3MLqF7sQSJ8ng81xDrnRvp8mOVkar9fCNZ88cTKWTSlT9IomezubayAA8gAlKr8ktLSG4FZOCTOAjBKRBcnOHzOCRXaXK1w+BJ7tHJHJ66V9p4EHkfAAipC4tods4WpYXS7W529cICgWlLt62cZVtTVf9jzxeI-GRa8hkYDAwHHRhGG+f4gSLZ15zdewKzhBFUmRVF0VSZtwzWXx3AkDV4hSH0XAkFc4NKBD0CQlDGQEIQRFZMQsg5BQU0IVj2MYN9BU-YUEDFDZEiCIIJDo5EvATEDyO8KMN2kNxHDhH0PF7QpqSEggROQxgADViEEYccwoPMC1fJ0BQ-HCYRSKsa1rOiGyPMijl0rs10SUISRCUJIzuIzDVMxDzNNc1LUczCXOwxcpM9IJfz9INAzJKQQzDAKgiCptQthdIwmPZjhLilDJzgDMGgoWBkvE1z0vLBAPHcH0kQKldzj9bJlRcL1FM2BTCQ1MkatitjzIa2AmpatrHGLd80q-eS1V9VxsgM8UFLxUbGNXFFwjCNxQjhSlopMsz6sa5rWonad2q2qSNVXdcFJ8FF6xC3TRouzwNUCFFtwKwk5oAdzwfBmAAGTAVAICSl8UrnV1Otw6SvR9HL4gUxj6y7Ub9IIBS5OyEMZGuKKHn7Qh4bUZg2uc7Gyzxmjf21a4vD8KRdKKpxUQSSGMm3UNYPu5mCHwbgKEnYgM1wfNeCZbiemkORBPlxXldV9WPpxr9AwlPFtyJH0qrhUDAwINFgn9GtpTcAojNwYgIDgOxDSws2MscFEneon1xX8IM5OVEVwjOfi0gyHISSvOWb1UCpNHoVAmFYDhA+51Z0TOYIPDcKRznRDtTsldJtRDlxd2keS5sz9RKnGeomhaSBC8krrtU8PTnZyoGDnI31V3JWtheJUIwkZ4z5bvCh+7cpxfQIUMa2kQIbt3RxlT3yV6J3K4TnFUM5tXhK4EtdfcY9I812uckKqB6Qj-Io8T3CBSQ57hDuXG+aYhxZjsnmR+21MRJEIiVfwBlfQakPMeM4-9qIzWAc4UBg5Hz4GgV9JEBATheE3NkYiIcgjKj8I4KmBJqbnHkiSOaj1GCEK6hqOhAQAgeW8JcfYosKLImHnJfYjhy4FRweneCdVLLWTALZUcEAOF432PCEmQQNybibjKEGfhoxeG3FKeSiQWEyJYnIu+FozCqI9NcMOJjI55RyNQ9SoN2wuH+j6W6hkmY3jYUtFa8BUpB04SETwZdJaMVplidSdEJQhH+kia43glJwwRqyFGaMH6hKLqKEMkpYR+H2MibUWidynQUpKDcUc5KA13BktmdjlyrmyPsXw250QSLcQFLwEpvBeLSDwwMd1-FDAaKjX2zA6jEFQMwFReSB48zSGuai9dfBNg1AZUackJShjMQpdI6RIxzUNirNWiyubLNWJcCUXYEwDTJMkaUcSApnVPjuZuoRcR3QKEAA */
    id: "Machine",
    schema: {
      context: {} as MachineContext,
      events: {} as MachineEvent,
    },
    tsTypes: {} as import("./game-machine.typegen").Typegen0,
    initial: "connectingToMainframe",
    context: {
      render: <div>Hello State Machine!</div>,
      round: 1,
    },
    states: {
      connectingToMainframe: {
        // TODO: pass in context and vent into components?
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
          5000: "promptDone",
        },
      },

      promptSubmitted: {
        entry: assign(() => ({
          render: (
            <TransitionWrapper key="promptSubmitted">
              <AnnouncementText text="Waiting For Companions to Submit" />
            </TransitionWrapper>
          ),
        })),
        on: {
          NEXT: "promptDone",
          MORE: "prompt",
        },
      },

      promptDone: {
        entry: assign(() => ({
          render: (
            <TransitionWrapper key="promptSubmitted">
              <AnnouncementText text="All Participants Have Submitted!" />
            </TransitionWrapper>
          ),
        })),
        on: {
          NEXT: "faceOff",
        },
      },

      faceOff: {
        on: {
          SUBMIT: "faceOffVoteSubmitted",
        },
        after: {
          30000: "faceOffTimesUp",
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
          5000: "prompt",
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
  },
  {
    guards: {
      completedRounds,
    },
  }
);
