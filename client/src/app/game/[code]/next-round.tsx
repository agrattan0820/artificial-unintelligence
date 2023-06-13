"use client";

import { motion } from "framer-motion";

type NextRoundProps = {
  nextQueryNum: number;
  totalQueries: number;
};

const NextRound = ({ nextQueryNum, totalQueries }: NextRoundProps) => {
  return (
    <h2 className="text-center text-5xl">
      Round{" "}
      <span className="relative">
        <span className="opacity-0">{nextQueryNum}</span>
        <motion.span
          className="absolute left-0"
          initial={{ y: 0, opacity: 1 }}
          animate={{ y: 15, opacity: 0 }}
          transition={{ delay: 1 }}
          aria-hidden={true}
        >
          {nextQueryNum - 1}
        </motion.span>
        <motion.span
          className="absolute left-0"
          initial={{ y: -15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          aria-hidden={true}
        >
          {nextQueryNum}
        </motion.span>
      </span>{" "}
      of {totalQueries}
    </h2>
  );
};

export default NextRound;
