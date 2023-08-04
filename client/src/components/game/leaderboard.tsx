"use client";

import { useContext } from "react";
import Image from "next/image";
import { EventFrom, StateFrom } from "xstate";
import { BsTrophy } from "react-icons/bs";
import { motion, Variants } from "framer-motion";

import FriendWithLegs from "./friend-with-legs";
import Crown from "@ai/images/crown.webp";
import { GameInfo, GetGameLeaderboardResponse } from "@ai/app/server-actions";
import { gameMachine } from "./game-machine";
import Button, { LinkSecondaryButton } from "../button";
import { SocketContext } from "@ai/utils/socket-provider";
import { useStore } from "@ai/utils/store";

type LeaderboardProps = {
  gameInfo: GameInfo;
  state: StateFrom<typeof gameMachine>;
  send: (event: EventFrom<typeof gameMachine>) => StateFrom<typeof gameMachine>;
  leaderboard: GetGameLeaderboardResponse | undefined;
  hostId: number | null;
};

const Leaderboard = ({ gameInfo, leaderboard, hostId }: LeaderboardProps) => {
  const socket = useContext(SocketContext);
  const { user } = useStore();

  const currUserIsHost = user && user?.id === hostId;

  const leaderboardListVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        delay: 1,
        when: "beforeChildren",
        staggerChildren: 0.3,
      },
    },
  };

  const leaderboardListItemVariants: Variants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
    },
  };

  if (!leaderboard) {
    return null;
  }

  const handlePlayAgainOnClick = () => {
    socket.emit("initiatePlayAnotherGame", gameInfo.game.roomCode);
  };

  return (
    <div className="mx-auto max-w-2xl text-center">
      <div className="mb-16">
        <motion.div className="relative mb-2 flex justify-center">
          <motion.div
            className="absolute top-[-52px]"
            initial={{ rotate: 12, y: -15, opacity: 0 }}
            animate={{ rotate: 3, y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <Image src={Crown} alt="Golden royalty crown" className="w-24" />
          </motion.div>
          <motion.div
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <FriendWithLegs />
          </motion.div>
        </motion.div>
        <motion.h2
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-3xl md:text-4xl"
        >
          Thanks for training with us!
        </motion.h2>
      </div>
      <motion.ol
        className="space-y-6"
        initial="hidden"
        animate="visible"
        variants={leaderboardListVariants}
      >
        {leaderboard.leaderboard.map((result, i) => (
          <motion.li
            key={i}
            className="relative flex items-center justify-center gap-4"
            variants={leaderboardListItemVariants}
          >
            {i + 1}.
            <div className="flex w-full justify-between gap-2 rounded-xl p-4 text-left text-xl dark:bg-slate-800">
              <p className="flex items-center gap-4">
                {result.user.nickname}{" "}
                {i === 0 && (
                  <span className="rounded-full bg-yellow-600 p-2 text-white">
                    <BsTrophy />
                  </span>
                )}
              </p>
              <p>{result.points.toLocaleString()} points</p>
            </div>
          </motion.li>
        ))}
      </motion.ol>
      <div className="mt-8 flex flex-col justify-center gap-2 sm:flex-row">
        {currUserIsHost && (
          <Button onClick={handlePlayAgainOnClick}>
            Play Again With Same Players
          </Button>
        )}
        <LinkSecondaryButton href="https://www.buymeacoffee.com/agrattan">
          Donate Cereal to Creator 🥣
        </LinkSecondaryButton>
      </div>
      {!currUserIsHost && (
        <p className="mt-4 max-w-sm w-full mx-auto text-sm">
          If you&apos;d like to play again, ask the host to start another game.
        </p>
      )}
    </div>
  );
};

export default Leaderboard;
