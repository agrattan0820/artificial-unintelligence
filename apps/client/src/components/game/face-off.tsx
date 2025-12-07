"use client";

import { useContext, useState } from "react";
import { motion } from "framer-motion";
import type { Session } from "next-auth";

import Button, { SecondaryButton } from "@ai/components/button";
import ImageChoice, { ImageOption } from "./image-choice";
import Ellipsis from "@ai/components/ellipsis";
import { GameInfo, QuestionGenerations } from "@ai/utils/queries";
import { SocketContext } from "@ai/utils/socket-provider";

type FaceOffProps = {
  gameInfo: GameInfo;
  currQuestionGenerations: QuestionGenerations | undefined;
  session: Session;
};

const FaceOff = ({
  gameInfo,
  currQuestionGenerations,
  session,
}: FaceOffProps) => {
  const socket = useContext(SocketContext);

  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageOption>();
  const [voteSubmitted, setVoteSubmitted] = useState(false);

  const currUserInFaceOff =
    session.user.id === currQuestionGenerations?.player1.id ||
    session.user.id === currQuestionGenerations?.player2.id;

  const onImageChoice = async () => {
    setLoading(true);

    if (session.user && selectedImage && currQuestionGenerations) {
      socket.emit("voteSubmitted", {
        gameId: gameInfo.game.id,
        questionId: currQuestionGenerations.question.id,
        generationId:
          selectedImage === 1
            ? currQuestionGenerations.player1Generation.id
            : currQuestionGenerations.player2Generation.id,
        userId: session.user.id,
      });
    }

    setLoading(false);
    setVoteSubmitted(true);
  };

  return (
    <div className="mx-auto max-w-2xl">
      {currQuestionGenerations ? (
        <>
          <div className="relative mb-14">
            <motion.h2
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              className="text-2xl"
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
            disabled={currUserInFaceOff || voteSubmitted}
          />
          <div className="mt-8">
            {currUserInFaceOff || voteSubmitted ? (
              <>
                <div className="fixed right-0 bottom-8 left-0 mx-auto w-full max-w-2xl px-6 md:hidden">
                  <SecondaryButton
                    className="w-full shadow-lg disabled:opacity-100"
                    disabled
                  >
                    Waiting for other trainers to finish voting...
                  </SecondaryButton>
                </div>
                <p className="hidden md:block">
                  Waiting for other trainers to finish voting...
                </p>
              </>
            ) : (
              <div className="fixed right-0 bottom-8 left-0 mx-auto w-full max-w-2xl px-6 md:static md:px-0">
                <Button
                  className="w-full shadow-lg md:w-auto"
                  onClick={onImageChoice}
                  disabled={!selectedImage || loading}
                >
                  {loading ? (
                    <Ellipsis />
                  ) : !selectedImage ? (
                    "Select an Image"
                  ) : (
                    "Confirm Vote"
                  )}
                </Button>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="text-center">
          <Ellipsis />
        </div>
      )}
    </div>
  );
};

export default FaceOff;
