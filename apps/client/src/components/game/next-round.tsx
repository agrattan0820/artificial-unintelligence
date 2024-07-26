"use client";

import { motion } from "framer-motion";

type NextRoundProps = {
  nextQueryNum: number;
  totalQueries: number;
};

const NextRound = ({ nextQueryNum, totalQueries }: NextRoundProps) => {
  return (
    <motion.h2
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="relative text-center text-3xl md:text-5xl"
    >
      Round{" "}
      <span className="relative">
        <span className="opacity-0">{nextQueryNum}</span>
        <span className="absolute left-0 top-1/2 inline-block -translate-y-1/2">
          <motion.span
            className="inline-block"
            initial={{ y: 0, opacity: 1 }}
            animate={{ y: 15, opacity: 0 }}
            transition={{ delay: 1 }}
            aria-hidden={true}
          >
            {nextQueryNum - 1}
          </motion.span>
        </span>
        <span className="absolute left-0 top-1/2 inline-block -translate-y-1/2">
          <motion.span
            className="inline-block"
            initial={{ y: -15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
            aria-hidden={true}
          >
            {nextQueryNum}
          </motion.span>
        </span>
      </span>{" "}
      of {totalQueries}
    </motion.h2>
  );
};

export default NextRound;
