"use client";

import { useContext, useState } from "react";
import { motion } from "framer-motion";
import { EventFrom, StateFrom } from "xstate";

import SadDog from "@ai/images/sad-dog.webp";
import SadDog2 from "@ai/images/sad-dog-2.webp";
import Button from "@ai/components/button";
import ImageChoice, { ImageOption } from "./image-choice";
import Ellipsis from "@ai/components/ellipsis";
import Timer from "./timer";
import { GameInfo, QuestionGenerations } from "@ai/app/server-actions";
import { gameMachine } from "./game-machine";
import { useStore } from "@ai/utils/store";
import { SocketContext } from "@ai/utils/socket-provider";

type FaceOffProps = {
  gameInfo: GameInfo;
  state: StateFrom<typeof gameMachine>;
  send: (event: EventFrom<typeof gameMachine>) => StateFrom<typeof gameMachine>;
  currQuestionGenerations: QuestionGenerations | undefined;
};

const FaceOff = ({
  gameInfo,
  state,
  send,
  currQuestionGenerations,
}: FaceOffProps) => {
  const { user } = useStore();
  const socket = useContext(SocketContext);

  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageOption>();
  const [voteSubmitted, setVoteSubmitted] = useState(false);

  const currUserInFaceOff =
    user?.id === currQuestionGenerations?.player1.id ||
    user?.id === currQuestionGenerations?.player2.id;

  const onImageChoice = async () => {
    setLoading(true);

    if (user && selectedImage && currQuestionGenerations) {
      socket.emit("voteSubmitted", {
        gameId: gameInfo.game.id,
        questionId: currQuestionGenerations.question.id,
        generationId:
          selectedImage === 1
            ? currQuestionGenerations.player1Generation.id
            : currQuestionGenerations.player2Generation.id,
        userId: user.id,
      });
    }

    setLoading(false);
    setVoteSubmitted(true);
  };

  return (
    <div className="mx-auto max-w-2xl">
      {/* <Timer totalSeconds={30} /> */}
      {currQuestionGenerations && (
        <>
          <div className="relative mb-14">
            <motion.h2
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              className="text-center text-lg md:text-2xl"
            >
              {currQuestionGenerations.question.text}
            </motion.h2>
          </div>
          <ImageChoice
            imageOption1={{
              src: currQuestionGenerations.player1Generation.imageUrl,
              alt: currQuestionGenerations.player1Generation.text,
            }}
            imageOption2={{
              src: currQuestionGenerations.player2Generation.imageUrl,
              alt: currQuestionGenerations.player2Generation.text,
            }}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            disabled={currUserInFaceOff}
          />
          <div className="mt-4">
            {currUserInFaceOff || voteSubmitted ? (
              <p>Waiting for other players to finish voting...</p>
            ) : (
              <Button
                onClick={onImageChoice}
                disabled={!selectedImage || loading}
              >
                {!loading ? "Confirm Vote" : <Ellipsis />}
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default FaceOff;
