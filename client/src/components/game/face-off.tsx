"use client";

import { useState } from "react";
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

const FaceOff = ({
  gameInfo,
  state,
  send,
  currQuestion,
}: {
  gameInfo: GameInfo;
  state: StateFrom<typeof gameMachine>;
  send: (event: EventFrom<typeof gameMachine>) => StateFrom<typeof gameMachine>;
  currQuestion: QuestionGenerations | undefined;
}) => {
  const gameId = gameInfo.game.id;
  const round = state.context.round;

  console.log("CURR QUESTION in FACE OFF", currQuestion);

  // 1. Query for generations from the current round

  // 2. Iterate through each question, getting the generations associated with each

  // 3. Once complete with the questions do the transition to the next round

  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageOption>();

  const onImageChoice = async () => {};

  return (
    <div className="mx-auto max-w-2xl">
      {/* <Timer totalSeconds={30} /> */}
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
      <ImageChoice
        imageOption1={SadDog}
        imageOption2={SadDog2}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
      />
      <div>
        <Button onClick={onImageChoice} disabled={!selectedImage || loading}>
          {!loading ? "Confirm Vote" : <Ellipsis />}
        </Button>
      </div>
    </div>
  );
};

export default FaceOff;
