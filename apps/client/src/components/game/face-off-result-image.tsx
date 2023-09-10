"use client";

import { Dispatch, SetStateAction, useEffect } from "react";
import {
  AnimatePresence,
  AnimationPlaybackControls,
  MotionStyle,
  Variants,
  animate,
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion";
import Image, { StaticImageData } from "next/image";
import { BsTrophy } from "react-icons/bs";

import { cn } from "@ai/utils/cn";
import { shuffleArray } from "@ai/utils/helpers";

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
    // scale: 1.1,
    opacity: 1,
    y: 0,
  },
  loser: {
    // scale: 0.8,
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
    },
  },
  loser: {
    opacity: 1,
    y: 0,
    transition: {
      delayChildren: 2.5,
    },
  },
  tie: {
    opacity: 1,
    y: 0,
    transition: {
      delayChildren: 1,
    },
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
const pointVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

const votePositions: MotionStyle[] = [
  { top: "5%", left: "5%", rotate: 12 },
  { top: "10%", left: "52%", rotate: -15 },
  { top: "25%", left: "8%", rotate: -2 },
  { top: "35%", left: "60%", rotate: 8 },
  { top: "45%", left: "4%", rotate: -8 },
  { top: "52%", left: "48%", rotate: 3 },
];

const shuffledVotePositions = shuffleArray(votePositions);

const FaceOffResultImage = ({
  id,
  prompt,
  nickname,
  percentage,
  image,
  bothImagesShown,
  showWinner,
  showLoser,
  showVotes,
  showPoints,
  winningImage,
  votes,
  pointIncrease,
  setShowImage,
}: {
  id: 1 | 2;
  prompt: string;
  nickname: string;
  percentage: number;
  image: string | StaticImageData;
  bothImagesShown: boolean;
  showWinner: boolean;
  showLoser: boolean;
  showVotes: boolean;
  showPoints: boolean;
  winningImage: 1 | 2 | null;
  votes: string[];
  pointIncrease: number;
  setShowImage: Dispatch<SetStateAction<boolean>>;
}) => {
  const points = useMotionValue(0);
  const animatedPoints = useTransform(points, (latest) => Math.round(latest));

  useEffect(() => {
    let controls: AnimationPlaybackControls;
    if (showPoints) {
      controls = animate(points, pointIncrease, { duration: 3 });
    }

    return () => {
      controls && controls.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pointIncrease, showPoints]);

  const isWinner = winningImage === id && showWinner;
  const isLoser = winningImage !== id && showLoser;
  const isTie = winningImage === null && showWinner;

  return (
    <motion.figure
      layout="position"
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
      className="relative w-full"
    >
      <motion.p
        initial={false}
        animate={showPoints ? "visible" : "hidden"}
        variants={pointVariants}
        className="absolute -top-8 left-0 right-0 z-0 text-center"
      >
        +<motion.span>{animatedPoints}</motion.span>
      </motion.p>
      <div className="relative">
        <Image
          className={cn(
            `aspect-square transform rounded-xl filter transition`,
            isWinner && "ring ring-yellow-600",
            winningImage !== id &&
              winningImage !== null &&
              showWinner &&
              "grayscale filter", // do black+white transition immediately when winner is shown
            showVotes && "brightness-50",
          )}
          src={image}
          alt={`OpenAI Image with the prompt: ${prompt}`}
          onLoad={() => setShowImage(true)}
          width={1024}
          height={1024}
        />
        <motion.ul
          initial={false}
          animate={showVotes ? "visible" : "hidden"}
          className="absolute inset-0 z-10"
          variants={voteVariants}
        >
          {votes.map((vote, i) => (
            <motion.li
              key={i}
              className="absolute inline-block rounded-md bg-indigo-300 p-2 shadow-md md:p-4"
              variants={voteItemVariants}
              style={shuffledVotePositions[i]}
            >
              <p className="text-xs text-black md:text-sm">{vote}</p>
            </motion.li>
          ))}
        </motion.ul>
      </div>

      <div
        className={cn(
          "absolute -right-2 -top-2 scale-0 transform rounded-full bg-yellow-600 p-2 text-xl text-white opacity-0 transition",
          isWinner && "scale-100 opacity-100",
        )}
      >
        <BsTrophy />
      </div>
      <motion.figcaption
        layout="position"
        initial={false}
        animate={
          isTie ? "tie" : isWinner ? "winner" : isLoser ? "loser" : "hidden"
        }
        variants={captionVariants}
        className="py-4"
      >
        <AnimatePresence>
          {(isWinner || isLoser || isTie) && (
            <motion.div
              key="nickname"
              initial={{ opacity: 0, y: -25 }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="mb-2 flex justify-between"
            >
              <h3 className="text-lg text-indigo-300">{nickname}</h3>{" "}
              <p>{percentage.toLocaleString()}%</p>
            </motion.div>
          )}
          {(isWinner || isLoser || isTie) && (
            <motion.p
              key="prompt"
              className="w-full text-sm md:text-base"
              initial={{ opacity: 0, y: -25 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { delay: 0.5 },
              }}
            >
              {prompt}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.figcaption>
    </motion.figure>
  );
};

export default FaceOffResultImage;
