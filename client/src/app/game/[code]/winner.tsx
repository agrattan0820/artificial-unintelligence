"use client";

import { BsTrophy } from "react-icons/bs";
import Crown from "@ai/images/crown.webp";
import Image from "next/image";
import { motion, animate, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";

const Winner = () => {
  const count = useMotionValue(0);
  const animatedPoints = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, 1500, { duration: 3 });

    return controls.stop;
  }, []);

  return (
    <div className="mx-auto max-w-2xl text-center">
      <h2 className="mb-24 text-2xl">Your Winning Ai Trainer!</h2>
      <motion.div className="flex items-center justify-center gap-6">
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative"
        >
          <Image
            src={Crown}
            alt="Golden royalty crown"
            className="absolute -top-16 left-1/2 w-40 -translate-x-1/2 transform"
          />
          <div className="h-48 w-48 rounded-full bg-indigo-600" />
        </motion.div>
        <motion.div className="text-left">
          <motion.h3
            initial={{ x: 15, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1 }}
            className="mb-2 text-4xl"
          >
            Big Al
          </motion.h3>
          <motion.p
            initial={{ x: 15, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="text-lg"
          >
            <motion.span>{animatedPoints}</motion.span> points
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Winner;
