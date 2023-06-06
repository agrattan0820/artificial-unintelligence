/* eslint-disable react/no-unescaped-entities */
"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Variants, motion } from "framer-motion";
import Image, { StaticImageData } from "next/image";
import { BsTrophy } from "react-icons/bs";

import SadDog from "@ai/images/sad-dog.webp";
import SadDog2 from "@ai/images/sad-dog-2.webp";
import { cn } from "@ai/utils/cn";
import Friend from "./friend";

const RoundResultImage = ({
  id,
  prompt,
  nickname,
  percentage,
  image,
  bothImagesShown,
  showWinner,
  winningImage,
  setShowImage,
}: {
  id: 1 | 2;
  prompt: string;
  nickname: string;
  percentage: number;
  image: string | StaticImageData;
  bothImagesShown: boolean;
  showWinner: boolean;
  winningImage: 1 | 2;
  setShowImage: Dispatch<SetStateAction<boolean>>;
}) => {
  const imageVariants: Variants = {
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
      filter: "grayscale(75%)",
    },
  };

  const captionVariants: Variants = {
    hidden: {
      opacity: 0,
      y: -25,
    },
    winner: {
      opacity: 1,
      y: 0,
      transition: {
        delayChildren: 1,
        staggerChildren: 0.5,
      },
    },
    loser: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 2.5,
        delayChildren: 2.5,
        staggerChildren: 0.5,
      },
    },
  };

  const captionItemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: -25,
    },
    winner: {
      opacity: 1,
      y: 0,
    },
    loser: {
      opacity: 1,
      y: 0,
    },
  };

  const isWinner = winningImage === id && showWinner;
  const isLoser = winningImage !== id && showWinner;

  return (
    <motion.figure
      initial={false}
      animate={
        isWinner
          ? "winner"
          : isLoser
          ? "loser"
          : bothImagesShown
          ? "visible"
          : "hidden"
      }
      variants={imageVariants}
      transition={{ when: "beforeChildren" }}
      className="relative"
    >
      <Image
        className={cn(
          `aspect-square transform rounded-xl transition`,
          showWinner && isWinner && "ring ring-yellow-600"
        )}
        src={image}
        alt={`OpenAI Image with the prompt: ${prompt}`}
        onLoad={() => setShowImage(true)}
        width={1024}
        height={1024}
      />
      <div
        className={cn(
          "absolute -right-2 -top-2 scale-0 transform rounded-full bg-yellow-600 p-2 text-xl text-white opacity-0 transition",
          isWinner && "scale-100 opacity-100"
        )}
      >
        <BsTrophy />
      </div>
      <motion.figcaption
        initial={false}
        animate={isWinner ? "winner" : isLoser ? "loser" : "hidden"}
        variants={captionVariants}
        className="py-4"
      >
        <motion.p variants={captionItemVariants} className="mb-4">
          {prompt}
        </motion.p>
        <motion.div
          variants={captionItemVariants}
          className="flex justify-between"
        >
          <h3 className="text-lg text-indigo-700 dark:text-indigo-300">
            {nickname}
          </h3>{" "}
          <p>{percentage.toLocaleString()}%</p>
        </motion.div>
      </motion.figcaption>
    </motion.figure>
  );
};

const RoundResult = () => {
  const [imageOption1, setImageOption1] = useState("");
  const [imageOption2, setImageOption2] = useState("");

  const [showImage1, setShowImage1] = useState(false);
  const [showImage2, setShowImage2] = useState(false);

  const [showWinner, setShowWinner] = useState(false);

  const bothShown = showImage1 && showImage2;

  const winningImage: 1 | 2 = 1;

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
      }, 2000);
    }

    return () => {
      clearTimeout(winnerTimeout);
    };
  }, [showImage1, showImage2]);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="relative mb-14">
        <div className="rounded-xl p-4">
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
        <motion.div
          initial={{ x: 10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex justify-end"
        >
          <Friend />
        </motion.div>
      </div>
      <div className="mb-16 flex gap-6">
        <RoundResultImage
          id={1}
          prompt="A dog dressed as a detective solving a murder at a McDonald's."
          nickname="Big Al"
          percentage={100}
          image={SadDog}
          bothImagesShown={bothShown}
          showWinner={showWinner}
          winningImage={winningImage}
          setShowImage={setShowImage1}
        />
        <RoundResultImage
          id={2}
          prompt="Saint Bernard shaking its chubby cheeks while it gets splashed by
              a hose."
          nickname="Lifeguard Dan"
          percentage={0}
          image={SadDog2}
          bothImagesShown={bothShown}
          showWinner={showWinner}
          winningImage={winningImage}
          setShowImage={setShowImage2}
        />
      </div>
    </div>
  );
};

export default RoundResult;
