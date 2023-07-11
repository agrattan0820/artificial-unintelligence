import { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  EventFrom,
  StateFrom,
  StateValueFrom,
  assign,
  createMachine,
} from "xstate";

import ConnectToMainframe from "./connect-to-mainframe";
import ConnectionEstablished from "./connection-established";
import Prompt from "./prompt";
import AnnouncementText from "./announcement-text";
import FaceOff from "./face-off";
import FaceOffResult from "./face-off-result";
import WinnerLeadUp from "./winner-lead-up";
import Winner from "./winner";
import Leaderboard from "./leaderboard";
import NextRound from "./next-round";
import PromptSubmitted from "./prompt-submitted";
import {
  GameInfo,
  GetGameLeaderboardResponse,
  QuestionGenerations,
  UserVote,
  Vote,
} from "@ai/app/server-actions";

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
  round: number;
  playerCount: number;
  questionIdx: number;
};
type MachineEvent = { type: "NEXT" } | { type: "SUBMIT" } | { type: "MORE" };

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
      round: 1,
      playerCount: 0,
      questionIdx: 0,
    },
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
          NEXT: "faceOffResults",
        },
      },

      faceOffResults: {
        after: {
          20000: [
            {
              target: "winnerLeadUp",
              cond: "completedRounds",
            },
            {
              target: "nextRound",
              cond: "completedCurrentRound",
            },
            {
              target: "faceOff",
              actions: "incrementQuestionIdx",
            },
          ],
        },
      },

      nextRound: {
        entry: "startNewRound",
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
        after: {
          10000: "leaderboard",
        },
      },

      leaderboard: {
        type: "final",
      },
    },
  },
  {
    actions: {
      startNewRound: assign({
        round: (context) => context.round + 1,
        questionIdx: 0,
      }),
      incrementQuestionIdx: assign({
        questionIdx: (context) => context.questionIdx + 1,
      }),
    },
    guards: {
      completedRounds: (context, event) => {
        return (
          context.round === 3 && context.playerCount === context.questionIdx + 1
        );
      },
      completedCurrentRound: (context, event) => {
        console.log("PLAYER COUNT", context.playerCount);
        console.log("QUESTION IDX", context.questionIdx);
        return context.playerCount === context.questionIdx + 1;
      },
    },
  }
);

export const getCurrentComponent = (
  gameInfo: GameInfo,
  state: StateFrom<typeof gameMachine>,
  send: (event: EventFrom<typeof gameMachine>) => StateFrom<typeof gameMachine>,
  submittedPlayerIds: Set<number>,
  currFaceOffQuestion: QuestionGenerations | undefined,
  votedPlayers: UserVote[],
  leaderboard: GetGameLeaderboardResponse | undefined
) => {
  const stateMachineComponentMap: Record<
    StateValueFrom<typeof gameMachine>,
    ReactNode
  > = {
    connectingToMainframe: (
      <TransitionWrapper key="connectingToMainframe">
        <ConnectToMainframe />
      </TransitionWrapper>
    ),
    connectionEstablished: (
      <TransitionWrapper key="connectionEstablished">
        <ConnectionEstablished />
      </TransitionWrapper>
    ),
    prompt: (
      <TransitionWrapper key="prompt">
        <Prompt gameInfo={gameInfo} state={state} send={send} />
      </TransitionWrapper>
    ),
    promptSubmitted: (
      <TransitionWrapper key="promptSubmitted">
        <PromptSubmitted
          gameInfo={gameInfo}
          state={state}
          submittedPlayerIds={submittedPlayerIds}
        />
      </TransitionWrapper>
    ),
    promptDone: (
      <TransitionWrapper key="promptDone">
        <AnnouncementText text="All Participants Have Submitted!" />
      </TransitionWrapper>
    ),
    faceOff: (
      <TransitionWrapper key="faceOff">
        <FaceOff
          gameInfo={gameInfo}
          state={state}
          send={send}
          currQuestionGenerations={currFaceOffQuestion}
        />
      </TransitionWrapper>
    ),
    faceOffResults: (
      <TransitionWrapper key="faceOffResults">
        <FaceOffResult
          gameInfo={gameInfo}
          state={state}
          send={send}
          currQuestionGenerations={currFaceOffQuestion}
          votedPlayers={votedPlayers}
        />
      </TransitionWrapper>
    ),
    nextRound: (
      <TransitionWrapper key="nextRound">
        <NextRound nextQueryNum={state.context.round} totalQueries={3} />
      </TransitionWrapper>
    ),
    winnerLeadUp: (
      <TransitionWrapper key="winnerLeadUp">
        <WinnerLeadUp />
      </TransitionWrapper>
    ),
    winner: (
      <TransitionWrapper key="winner">
        <Winner
          gameInfo={gameInfo}
          state={state}
          send={send}
          leaderboard={leaderboard}
        />
      </TransitionWrapper>
    ),
    leaderboard: (
      <TransitionWrapper key="leaderboard">
        <Leaderboard
          gameInfo={gameInfo}
          state={state}
          send={send}
          leaderboard={leaderboard}
        />
      </TransitionWrapper>
    ),
  };

  return stateMachineComponentMap[
    state.value as StateValueFrom<typeof gameMachine>
  ];
};
