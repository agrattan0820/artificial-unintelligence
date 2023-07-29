"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
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
import { EventFrom, StateFrom } from "xstate";

import { cn } from "@ai/utils/cn";
import FriendWithLegs from "./friend-with-legs";
import {
  GameInfo,
  QuestionGenerations,
  UserVote,
} from "@ai/app/server-actions";
import { gameMachine } from "./game-machine";

type FaceOffResultProps = {
  gameInfo: GameInfo;
  state: StateFrom<typeof gameMachine>;
  send: (event: EventFrom<typeof gameMachine>) => StateFrom<typeof gameMachine>;
  currQuestionGenerations: QuestionGenerations | undefined;
  votedPlayers: UserVote[];
};

const FaceOffResult = ({
  gameInfo,
  state,
  send,
  currQuestionGenerations,
  votedPlayers,
}: FaceOffResultProps) => {
  const player1 = currQuestionGenerations?.player1;
  const player2 = currQuestionGenerations?.player2;
  const image1 = currQuestionGenerations?.player1Generation;
  const image2 = currQuestionGenerations?.player2Generation;

  const voteMap = votedPlayers.reduce<{
    player1Votes: UserVote[];
    player2Votes: UserVote[];
  }>(
    (acc, curr) => {
      if (curr.vote.generationId === image1?.id) {
        acc.player1Votes.push(curr);
      }

      if (curr.vote.generationId === image2?.id) {
        acc.player2Votes.push(curr);
      }

      return acc;
    },
    { player1Votes: [], player2Votes: [] }
  );

  const pointsPerOnePercent = 10;

  const image1VotePercentage =
    Math.round(voteMap.player1Votes.length / votedPlayers.length) * 100;
  const image1Points = image1VotePercentage * pointsPerOnePercent;
  const image2VotePercentage =
    Math.round(voteMap.player2Votes.length / votedPlayers.length) * 100;
  const image2Points = image2VotePercentage * pointsPerOnePercent;

  const winningImage: 1 | 2 =
    voteMap.player1Votes.length > voteMap.player2Votes.length ? 1 : 2;

  const [showImage1, setShowImage1] = useState(false);
  const [showImage2, setShowImage2] = useState(false);
  const [showWinner, setShowWinner] = useState(false);

  const bothShown = showImage1 && showImage2;

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

  if (!image1 || !image2 || !player1 || !player2) {
    return null;
  }

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
            {currQuestionGenerations.question.text}
          </motion.h2>
        </div>
        <motion.div
          initial={{ x: 10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex justify-end"
        >
          <FriendWithLegs />
        </motion.div>
      </div>
      <div className="mb-16 flex gap-6">
        <FaceOffResultImage
          id={1}
          prompt={image1.text}
          nickname={player1.nickname}
          percentage={image1VotePercentage}
          image={image1.imageUrl}
          bothImagesShown={bothShown}
          showWinner={showWinner}
          winningImage={winningImage}
          votes={voteMap.player1Votes.map(
            (votedPlayer) => votedPlayer.user.nickname
          )}
          pointIncrease={image1Points}
          setShowImage={setShowImage1}
        />
        <FaceOffResultImage
          id={2}
          prompt={image2.text}
          nickname={player2.nickname}
          percentage={image2VotePercentage}
          image={image2.imageUrl}
          bothImagesShown={bothShown}
          showWinner={showWinner}
          winningImage={winningImage}
          votes={voteMap.player2Votes.map(
            (votedPlayer) => votedPlayer.user.nickname
          )}
          pointIncrease={image2Points}
          setShowImage={setShowImage2}
        />
      </div>
    </div>
  );
};

export default FaceOffResult;

const FaceOffResultImage = ({
  id,
  prompt,
  nickname,
  percentage,
  image,
  bothImagesShown,
  showWinner,
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
  winningImage: 1 | 2;
  votes: string[];
  pointIncrease: number;
  setShowImage: Dispatch<SetStateAction<boolean>>;
}) => {
  const [showVotes, setShowVotes] = useState(false);
  const [showPoints, setShowPoints] = useState(false);

  const points = useMotionValue(0);
  const animatedPoints = useTransform(points, (latest) => Math.round(latest));

  useEffect(() => {
    let votesTimeout: NodeJS.Timeout;
    let pointsTimeout: NodeJS.Timeout;
    let controls: AnimationPlaybackControls;
    if (bothImagesShown) {
      votesTimeout = setTimeout(() => {
        setShowVotes(true);
      }, 6000);
      pointsTimeout = setTimeout(() => {
        setShowPoints(true);
        controls = animate(points, pointIncrease, { duration: 3 });
      }, 8000);
    }

    return () => {
      clearTimeout(votesTimeout);
      clearTimeout(pointsTimeout);
      controls && controls.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bothImagesShown, pointIncrease]);

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

  const isWinner = winningImage === id && showWinner;
  const isLoser = winningImage !== id && showWinner;

  const votePositions: MotionStyle[] = [
    { top: "5%", left: "5%", rotate: 12 },
    { top: "10%", left: "52%", rotate: -15 },
    { top: "25%", left: "8%", rotate: -2 },
    { top: "35%", left: "60%", rotate: 8 },
    { top: "45%", left: "4%", rotate: -8 },
    { top: "52%", left: "48%", rotate: 3 },
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
      <motion.p
        initial={false}
        animate={showPoints ? "visible" : "hidden"}
        variants={pointVariants}
        className="absolute -top-8 left-0 right-0 z-0 text-center"
      >
        <motion.span>{animatedPoints}</motion.span>+
      </motion.p>
      <motion.ul
        initial={false}
        animate={showVotes ? "visible" : "hidden"}
        className="absolute inset-0 z-10"
        variants={voteVariants}
      >
        {votes.map((vote, i) => (
          <motion.li
            key={i}
            className="absolute inline-block rounded-md bg-indigo-300 p-4 shadow-md"
            variants={voteItemVariants}
            style={votePositions[i]}
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
