"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import Button, { SecondaryButton } from "@ai/components/button";
import { generateImage, generatePrompt } from "@ai/utils/query";
import Ellipsis from "@ai/components/ellipsis";
import ImageChoice, { ImageOption } from "./image-choice";
import Timer from "./timer";
import { GameInfo } from "@ai/app/server-actions";
import { EventFrom, StateFrom } from "xstate";
import { gameMachine } from "./game-machine";
import { useStore } from "@ai/utils/store";
import toast from "react-hot-toast";

interface FormElementsType extends HTMLFormControlsCollection {
  prompt: HTMLInputElement;
}

export interface PromptFormType extends HTMLFormElement {
  readonly elements: FormElementsType;
}

const Prompt = ({
  gameInfo,
  state,
  send,
}: {
  gameInfo: GameInfo;
  state: StateFrom<typeof gameMachine>;
  send: (event: EventFrom<typeof gameMachine>) => StateFrom<typeof gameMachine>;
}) => {
  const { user } = useStore();

  const currRound = state.context.round;

  const questions = useMemo(() => {
    return gameInfo.questions.filter((question) => {
      return (
        question.round === currRound &&
        (question.player1 === user?.id || question.player2 === user?.id)
      );
    });
  }, [currRound, gameInfo.questions, user?.id]);

  // STATE MACHINE TO HANDLE THE TWO QUESTIONS OF THE CURRENT ROUND
  const [stage, setStage] = useState<"FIRST" | "SECOND">("FIRST");

  const currQuestion = stage === "FIRST" ? questions[0] : questions[1];

  const [loading, setLoading] = useState(false);
  const [imagePrompt, setImagePrompt] = useState("");
  const [imageOption1, setImageOption1] = useState("");
  const [imageOption2, setImageOption2] = useState("");
  const [selectedImage, setSelectedImage] = useState<ImageOption>();

  const imagesLoaded = imageOption1 && imageOption2;

  const onPromptSubmit = async (e: FormEvent<PromptFormType>) => {
    e.preventDefault();
    setLoading(true);
    const formPrompt = e.currentTarget.elements.prompt.value;

    const images = await generateImage(formPrompt);

    if (!images) {
      console.error("Images were unable to be generated");
      toast.error("I'm afraid I don't know how to process such a request.");
    } else {
      setImageOption1(images[0].url ?? "");
      setImageOption2(images[1].url ?? "");
    }

    setLoading(false);
  };

  const handleImagePromptChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setImagePrompt(e.target.value);
  };

  const resetImages = () => {
    setImageOption1("");
    setImageOption2("");
    setSelectedImage(undefined);
  };

  const onImageSubmit = async () => {
    setLoading(true);

    if (stage === "FIRST") {
      setStage("SECOND");
      setImagePrompt("");
      resetImages();
    } else {
      send({ type: "SUBMIT" });
    }

    setLoading(false);
  };

  return (
    <motion.div layout className="max-w-2xl">
      {/* <Timer totalSeconds={90} /> */}
      <div className="relative mb-14">
        <AnimatePresence>
          <motion.h2
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            className="text-lg md:text-2xl"
          >
            {currQuestion ? currQuestion.text : null}
          </motion.h2>
        </AnimatePresence>
      </div>
      <ImageChoice
        imageOption1={imageOption1}
        imageOption2={imageOption2}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
      />
      <AnimatePresence>
        {!imagesLoaded && (
          <motion.form
            initial={{ y: 25, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 25, opacity: 0, transition: { delay: 1 } }}
            onSubmit={onPromptSubmit}
          >
            <div className="relative mb-8">
              <textarea
                id="prompt"
                placeholder="Describe a funny image"
                rows={5}
                cols={33}
                maxLength={500}
                className="peer w-full resize-none rounded-xl border-2 border-gray-300 bg-transparent p-4 placeholder-transparent focus:border-indigo-600 focus:outline-none focus:dark:border-indigo-300"
                onChange={handleImagePromptChange}
                required
              />
              <label
                htmlFor="prompt"
                className="absolute -top-6 left-2 text-sm text-gray-600 transition-all peer-placeholder-shown:left-4 peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-6 peer-focus:left-2 peer-focus:text-sm peer-focus:text-gray-600 dark:text-gray-400 dark:peer-focus:text-gray-400"
              >
                Describe a funny image
              </label>
            </div>
            <Button type="submit" disabled={loading}>
              {!loading ? "Submit Prompt" : <Ellipsis />}
            </Button>
          </motion.form>
        )}
        {imagesLoaded && (
          <div className="mt-4">
            <p className="mb-8">{imagePrompt}</p>
            <div className="flex gap-2">
              <Button
                onClick={onImageSubmit}
                disabled={!selectedImage || loading}
              >
                {!loading ? "Submit Image" : <Ellipsis />}
              </Button>
              <SecondaryButton onClick={resetImages} disabled={loading}>
                {!loading ? "Try New Prompt" : <Ellipsis />}
              </SecondaryButton>
            </div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Prompt;
