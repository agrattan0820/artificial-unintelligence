"use client";

import Image from "next/image";
import {
  motion,
  animate,
  useMotionValue,
  useTransform,
  AnimationPlaybackControls,
} from "framer-motion";
import { useEffect, useMemo } from "react";

import Crown from "@ai/images/crown.webp";
import { GetGameLeaderboardResponse } from "@ai/utils/queries";

type WinnerProps = {
  leaderboard: GetGameLeaderboardResponse | undefined;
};

const Winner = ({ leaderboard }: WinnerProps) => {
  const count = useMotionValue(0);
  const animatedPoints = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    let controls: AnimationPlaybackControls;
    if (leaderboard) {
      controls = animate(count, leaderboard.leaderboard[0].points, {
        duration: 3,
      });
    }

    return () => {
      controls && controls.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const winners = useMemo(
    () =>
      leaderboard
        ? leaderboard.leaderboard.filter((player) => player.standing === 1)
        : [],
    [leaderboard],
  );

  const winnerTitle = useMemo(() => {
    if (!leaderboard) {
      return "";
    }

    if (winners.length === 1) {
      return winners[0].user.nickname;
    }

    if (winners.length === 2) {
      return `${winners[0].user.nickname} and ${winners[1].user.nickname}`;
    }

    return `${winners
      .map((winner) => winner.user.nickname)
      .slice(0, winners.length - 1)
      .join(", ")}, and ${winners[winners.length - 1].user.nickname}`;
  }, [leaderboard, winners]);

  if (!leaderboard) {
    return null;
  }

  return (
    <motion.div layout className="mx-auto max-w-2xl text-center">
      <motion.div layout className="relative">
        <motion.div
          initial={{ y: -15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 3 }}
        >
          <Image
            src={Crown}
            alt="Golden royalty crown"
            className="absolute -top-24 left-1/2 w-32 -translate-x-1/2 transform md:-top-28 md:w-40"
          />
        </motion.div>
        <motion.h3
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1 }}
          className="mb-5 text-4xl md:text-7xl"
        >
          {winnerTitle}
        </motion.h3>
        <motion.p
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-xl"
        >
          <motion.span>{animatedPoints}</motion.span> points
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default Winner;
