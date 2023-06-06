/* eslint-disable react/no-unescaped-entities */
"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MotionStyle, Variants, motion } from "framer-motion";
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
  votes,
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
  votes: string[];
  setShowImage: Dispatch<SetStateAction<boolean>>;
}) => {
  const [showVotes, setShowVotes] = useState(false);

  useEffect(() => {
    let votesTimeout: NodeJS.Timeout;
    if (bothImagesShown) {
      votesTimeout = setTimeout(() => {
        setShowVotes(true);
      }, 6000);
    }

    return () => {
      clearTimeout(votesTimeout);
    };
  }, [bothImagesShown]);

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
      scale: 0.8,
      opacity: 1,
      y: 0,
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

  const voteVariants: Variants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.5,
      },
    },
  };
  const voteItemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 5,
    },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  const isWinner = winningImage === id && showWinner;
  const isLoser = winningImage !== id && showWinner;

  const voteLayouts: MotionStyle[] = [
    { top: "5%", left: "5%", rotate: 12 },
    { top: "10%", left: "52%", rotate: -15 },
    { top: "25%", left: "8%", rotate: -2 },
    { top: "35%", left: "60%", rotate: 8 },
    { top: "45%", left: "4%", rotate: -8 },
    { top: "50%", left: "48%", rotate: 3 },
  ];

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
      <motion.ul
        initial={false}
        animate={showVotes ? "visible" : "hidden"}
        className="absolute inset-0 z-10"
        variants={voteVariants}
      >
        {votes.map((vote, i) => (
          <motion.li
            key={i}
            className="absolute inline-block rounded-md bg-indigo-300 p-4 shadow-xl"
            variants={voteItemVariants}
            style={voteLayouts[i]}
          >
            <p className="text-sm text-black">{vote}</p>
          </motion.li>
        ))}
      </motion.ul>
      <Image
        className={cn(
          `aspect-square transform rounded-xl filter transition`,
          isWinner && "ring ring-yellow-600",
          isLoser && "grayscale filter",
          showVotes && "brightness-50"
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
          percentage={75}
          image={SadDog}
          bothImagesShown={bothShown}
          showWinner={showWinner}
          winningImage={winningImage}
          votes={[
            "Big Al Dos",
            "billy joel",
            "Lego Pirate",
            "Lego Yoda",
            "boyyyyy",
            "holaaaa",
          ]}
          setShowImage={setShowImage1}
        />
        <RoundResultImage
          id={2}
          prompt="Saint Bernard shaking its chubby cheeks while it gets splashed by
              a hose."
          nickname="Lifeguard Dan"
          percentage={25}
          image={SadDog2}
          bothImagesShown={bothShown}
          showWinner={showWinner}
          winningImage={winningImage}
          votes={["Kylie", "Roy"]}
          setShowImage={setShowImage2}
        />
      </div>
    </div>
  );
};

export default RoundResult;
