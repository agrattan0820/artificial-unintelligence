"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { QuestionGenerations, UserVote } from "@ai/utils/queries";
import FaceOffResultImage from "./face-off-result-image";

type FaceOffResultProps = {
  currQuestionGenerations: QuestionGenerations | undefined;
  votedPlayers: UserVote[];
};

const FaceOffResult = ({
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
    { player1Votes: [], player2Votes: [] },
  );

  const pointsPerOnePercent = 10;

  const image1VotePercentage =
    (voteMap.player1Votes.length / votedPlayers.length) * 100;
  const image1Points = image1VotePercentage * pointsPerOnePercent;
  const image2VotePercentage =
    (voteMap.player2Votes.length / votedPlayers.length) * 100;
  const image2Points = image2VotePercentage * pointsPerOnePercent;

  const winningImage: 1 | 2 | null =
    voteMap.player1Votes.length > voteMap.player2Votes.length
      ? 1
      : voteMap.player1Votes.length < voteMap.player2Votes.length
      ? 2
      : null;

  const [showImage1, setShowImage1] = useState(false);
  const [showImage2, setShowImage2] = useState(false);
  const [showWinner, setShowWinner] = useState(false);
  const [showLoser, setShowLoser] = useState(false);
  const [showVotes, setShowVotes] = useState(false);
  const [showPoints, setShowPoints] = useState(false);

  const bothShown = showImage1 && showImage2;

  useEffect(() => {
    let winnerTimeout: NodeJS.Timeout;
    let loserTimeout: NodeJS.Timeout;
    let votesTimeout: NodeJS.Timeout;
    let pointsTimeout: NodeJS.Timeout;
    if (showImage1 && showImage2) {
      winnerTimeout = setTimeout(() => {
        setShowWinner(true);
      }, 2000);
      loserTimeout = setTimeout(() => {
        setShowLoser(true);
      }, 4000);
      votesTimeout = setTimeout(() => {
        setShowVotes(true);
      }, 6000);
      pointsTimeout = setTimeout(() => {
        setShowPoints(true);
      }, 8000);
    }

    return () => {
      clearTimeout(winnerTimeout);
      clearTimeout(loserTimeout);
      clearTimeout(votesTimeout);
      clearTimeout(pointsTimeout);
    };
  }, [showImage1, showImage2]);

  if (!image1 || !image2 || !player1 || !player2) {
    return null;
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="relative mb-20">
        <motion.h2
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 10, opacity: 0 }}
          className="text-2xl"
        >
          {currQuestionGenerations.question.text}
        </motion.h2>
      </div>
      <motion.div layout="position" className="relative mb-16 flex gap-6">
        <AnimatePresence>
          {image1Points === image2Points && showWinner && (
            <motion.div className="absolute -top-12 left-1/2 -translate-x-1/2 text-center">
              <motion.h3
                className="text-lg"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
              >
                Tie!
              </motion.h3>
            </motion.div>
          )}
        </AnimatePresence>

        <FaceOffResultImage
          id={1}
          prompt={image1.text}
          nickname={player1.nickname}
          percentage={image1VotePercentage}
          image={image1.imageUrl}
          bothImagesShown={bothShown}
          showWinner={showWinner}
          showLoser={showLoser}
          showVotes={showVotes}
          showPoints={showPoints}
          winningImage={winningImage}
          votes={voteMap.player1Votes.map(
            (votedPlayer) => votedPlayer.user.nickname,
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
          showLoser={showLoser}
          showVotes={showVotes}
          showPoints={showPoints}
          winningImage={winningImage}
          votes={voteMap.player2Votes.map(
            (votedPlayer) => votedPlayer.user.nickname,
          )}
          pointIncrease={image2Points}
          setShowImage={setShowImage2}
        />
      </motion.div>
    </div>
  );
};

export default FaceOffResult;
