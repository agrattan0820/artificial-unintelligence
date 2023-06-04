"use client";

import { Variants, motion } from "framer-motion";
import Image, { StaticImageData } from "next/image";

import ImageChoice from "./image-choice";
import SadDog from "@ai/images/sad-dog.webp";
import SadDog2 from "@ai/images/sad-dog-2.webp";
import Button from "@ai/components/button";
import Ellipsis from "@ai/components/ellipsis";
import { cn } from "@ai/utils/cn";
import { useEffect, useState } from "react";

const RoundResult = () => {
  const [imageOption1, setImageOption1] = useState("");
  const [imageOption2, setImageOption2] = useState("");

  const [showImage1, setShowImage1] = useState(false);
  const [showImage2, setShowImage2] = useState(false);

  const [showWinner, setShowWinner] = useState(false);

  const bothShown = showImage1 && showImage2;

  const winningImage: number = 1;

  useEffect(() => {
    if (!imageOption1) {
      setShowImage1(false);
    }
    if (!imageOption2) {
      setShowImage2(false);
    }
  }, [imageOption1, imageOption2]);

  useEffect(() => {
    let winnerTimeout: NodeJS.Timeout;
    if (showImage1 && showImage2) {
      winnerTimeout = setTimeout(() => {
        setShowWinner(true);
      }, 3000);
    }

    return () => {
      clearTimeout(winnerTimeout);
    };
  }, [showImage1, showImage2]);

  const image1Variants: Variants = {
    hidden: {
      opacity: 0,
      y: -15,
    },
    visible: {
      opacity: 1,
      y: 0,
    },
    winner: {
      scale: 1.1,
      opacity: 1,
      y: 0,
    },
    loser: {
      scale: 0.75,
      opacity: 1,
      y: 0,
    },
  };
  const image2Variants: Variants = {
    hidden: {
      opacity: 0,
      y: -15,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3,
      },
    },
    winner: {
      scale: 1.1,
      opacity: 1,
      y: 0,
    },
    loser: {
      scale: 0.9,
      opacity: 1,
      y: 0,
      filter: "grayscale(75%)",
    },
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="relative mb-14">
        <motion.h2
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 10, opacity: 0 }}
          className="text-center text-lg md:text-2xl"
        >
          Which is the funnier{" "}
          <span className="text-indigo-700 dark:text-indigo-300">Dog</span>{" "}
          image?
        </motion.h2>
      </div>
      <div className="mb-16 flex gap-6">
        <motion.div
          initial={false}
          animate={
            showWinner && winningImage === 1
              ? "winner"
              : showWinner && winningImage !== 1
              ? "loser"
              : bothShown
              ? "visible"
              : "hidden"
          }
          variants={image1Variants}
        >
          <Image
            className={cn(
              `aspect-square transform rounded-xl transition`,
              showWinner && winningImage === 1 && "ring ring-yellow-600"
            )}
            src={SadDog}
            alt="OpenAI Image"
            onLoad={() => setShowImage1(true)}
            width={1024}
            height={1024}
          />
        </motion.div>
        <motion.div
          initial={false}
          animate={
            showWinner && winningImage === 2
              ? "winner"
              : showWinner && winningImage !== 2
              ? "loser"
              : bothShown
              ? "visible"
              : "hidden"
          }
          variants={image2Variants}
        >
          <button className="relative" disabled={!showImage2}>
            <Image
              className={cn(
                `aspect-square transform rounded-xl transition`,
                showWinner && winningImage === 2 && "ring ring-yellow-600"
              )}
              src={SadDog2}
              alt="OpenAI Image"
              onLoad={() => setShowImage2(true)}
              width={1024}
              height={1024}
            />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default RoundResult;
