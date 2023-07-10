"use client";

import Image from "next/image";
import {
  motion,
  animate,
  useMotionValue,
  useTransform,
  Variants,
} from "framer-motion";
import { useEffect, useState } from "react";
import { EventFrom, StateFrom } from "xstate";

import SadDog from "@ai/images/sad-dog.webp";
import SadDog2 from "@ai/images/sad-dog-2.webp";
import Crown from "@ai/images/crown.webp";
import { GameInfo } from "@ai/app/server-actions";
import { gameMachine } from "./game-machine";

type WinnerProps = {
  gameInfo: GameInfo;
  state: StateFrom<typeof gameMachine>;
  send: (event: EventFrom<typeof gameMachine>) => StateFrom<typeof gameMachine>;
};

const Winner = ({ gameInfo, state, send }: WinnerProps) => {
  const count = useMotionValue(0);
  const animatedPoints = useTransform(count, (latest) => Math.round(latest));
  const [showImages, setShowImages] = useState(false);

  const images = [
    {
      src: SadDog,
      prompt: "A dog dressed as a detective solving a murder at a McDonald's.",
    },
    {
      src: SadDog2,
      prompt:
        "Saint Bernard shaking its chubby cheeks while it gets splashed by a hose.",
    },
    {
      src: Crown,
      prompt: "A cool crown.",
    },
  ];

  useEffect(() => {
    const controls = animate(count, 1500, { duration: 3 });

    return controls.stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const showImagesTimer = setTimeout(() => {
      setShowImages(true);
    }, 4000);

    return () => {
      clearTimeout(showImagesTimer);
    };
  }, []);

  const imageListVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.3,
      },
    },
  };
  const imageListItemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 15,
    },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <motion.div layout className="mx-auto max-w-2xl text-center">
      {/* <div className="mb-40">
        <motion.h2
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-2xl"
        >
          And my winning Ai trainer is...
        </motion.h2>
        <motion.div
          initial={{ x: 15, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex justify-end"
        >
          <Friend />
        </motion.div>
      </div> */}
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
          Big Al
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
      {showImages && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={imageListVariants}
          className="mt-16 flex gap-6 overflow-x-auto py-4 md:flex-wrap md:py-0"
        >
          {images.map((image, i) => (
            <motion.figure
              key={i}
              variants={imageListItemVariants}
              className="w-40 min-w-[10rem] flex-1 text-left"
            >
              <Image
                src={image.src}
                alt={image.prompt}
                className="mb-2 w-40 rounded-xl"
                width={160}
              />
              <figcaption className="line-clamp-3 text-sm">
                {image.prompt}
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Winner;
