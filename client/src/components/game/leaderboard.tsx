"use client";

import Image from "next/image";
import FriendWithLegs from "./friend-with-legs";
import Crown from "@ai/images/crown.webp";
import { motion, Variants } from "framer-motion";
import { BsTrophy } from "react-icons/bs";

const Leaderboard = () => {
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

  const results = [
    { nickname: "Big Al", points: 1500 },
    { nickname: "Some Long Nickname Woahhhh", points: 1200 },
  ];

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
        {results.map((result, i) => (
          <motion.li
            key={i}
            className="relative flex items-center justify-center gap-4"
            variants={leaderboardListItemVariants}
          >
            {i + 1}.
            <div className="flex w-full justify-between gap-2 rounded-xl p-4 text-left text-xl dark:bg-slate-800">
              <p className="flex items-center gap-4">
                {result.nickname}{" "}
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
    </div>
  );
};

export default Leaderboard;
