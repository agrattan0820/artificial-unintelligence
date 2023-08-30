"use client";

import {
  FormEvent,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EventFrom, StateFrom } from "xstate";
import toast from "react-hot-toast";
import { FiHelpCircle, FiX } from "react-icons/fi";

import Button, { SecondaryButton } from "@ai/components/button";
import { generateOpenAIImage, generateSDXLImage } from "@ai/utils/query";
import Ellipsis from "@ai/components/ellipsis";
import ImageChoice, { ImageOption } from "./image-choice";
import { GameInfo, createGenerations } from "@ai/app/server-actions";
import { gameMachine } from "./game-machine";
import { useStore } from "@ai/utils/store";
import { SocketContext } from "@ai/utils/socket-provider";

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
  const socket = useContext(SocketContext);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const gameId = gameInfo.game.id;
  const userId = user?.id;
  const userGameRoundGenerations = gameInfo.gameRoundGenerations.filter(
    (generation) => generation.user.id === userId,
  );

  const currRound = state.context.round;
  const maxRegenerations = 3;

  const isSecondStage =
    userGameRoundGenerations.length > 1 &&
    (userGameRoundGenerations[0].generation.selected ||
      userGameRoundGenerations[1].generation.selected);
  const shouldShowGenerations =
    userGameRoundGenerations.length > 1 &&
    !userGameRoundGenerations[0].generation.selected &&
    !userGameRoundGenerations[1].generation.selected;

  const [numGenerations, setNumGenerations] = useState(
    userGameRoundGenerations.length,
  );

  const remainingImageGenerations = maxRegenerations - (numGenerations - 2) / 2;
  const outOfRegenerations = remainingImageGenerations === 0;

  const [stage, setStage] = useState<"FIRST" | "SECOND">(
    isSecondStage ? "SECOND" : "FIRST",
  );
  const [loading, setLoading] = useState(false);
  const [imagePrompt, setImagePrompt] = useState(
    shouldShowGenerations ? userGameRoundGenerations[0].generation.text : "",
  );
  const [imageOption1, setImageOption1] = useState(
    shouldShowGenerations ? userGameRoundGenerations[0].generation : undefined,
  );
  const [imageOption2, setImageOption2] = useState(
    shouldShowGenerations ? userGameRoundGenerations[1].generation : undefined,
  );
  const [selectedImage, setSelectedImage] = useState<ImageOption>();

  const imagesLoaded = imageOption1 && imageOption2;

  const questions = useMemo(() => {
    return gameInfo.questions.filter((question) => {
      return (
        question.round === currRound &&
        (question.player1 === user?.id || question.player2 === user?.id)
      );
    });
  }, [currRound, gameInfo.questions, user?.id]);
  const currQuestion = stage === "FIRST" ? questions[0] : questions[1];

  const onPromptSubmit = async (e: FormEvent<PromptFormType>) => {
    e.preventDefault();
    setLoading(true);
    const formPrompt = e.currentTarget.elements.prompt.value;

    console.time("Execution Time");

    const images = await generateSDXLImage(formPrompt);

    console.timeEnd("Execution Time");

    if (!images) {
      console.error("Images were unable to be generated");
      toast.error("I'm afraid I don't know how to process such a request.");
    } else {
      setImagePrompt(formPrompt);

      if (userId) {
        const generations = await createGenerations({
          userId,
          gameId,
          questionId: currQuestion.id,
          images: images?.map((image) => {
            return {
              text: formPrompt,
              imageUrl: image,
            };
          }),
        });

        setImageOption1(generations[0]);
        setImageOption2(generations[1]);

        setNumGenerations(numGenerations + generations.length);
      }
    }

    setLoading(false);
  };

  const resetImage = () => {
    setImageOption1(undefined);
    setImageOption2(undefined);
    setSelectedImage(undefined);
  };

  const onTryAnotherPrompt = () => {
    resetImage();
  };

  const onImageSubmit = async () => {
    setLoading(true);

    if (user && imageOption1 && imageOption2) {
      socket.emit("generationSubmitted", {
        generationId: selectedImage === 1 ? imageOption1?.id : imageOption2?.id,
        gameId: gameId,
        round: currRound,
      });
    } else {
      console.error("User was not defined when trying to submit a generation");
      toast.error("Oops, we can't submit your generation.");
      setLoading(false);
      return;
    }

    if (stage === "FIRST") {
      setStage("SECOND");
      setImagePrompt("");
      resetImage();
    } else {
      send({ type: "SUBMIT" });
    }

    setLoading(false);
  };

  useEffect(() => {
    // Redirect to prompt submitted page if the player already has two images submitted for the round
    const alreadySubmittedImages =
      userGameRoundGenerations.filter(
        (generation) => generation.generation.selected,
      ).length >= 2;

    if (alreadySubmittedImages) {
      send({ type: "SUBMIT" });
    }
  }, [send, userGameRoundGenerations]);

  return (
    <motion.div layout="position" className="max-w-2xl">
      {/* <Timer totalSeconds={90} /> */}
      <div className="relative mb-14">
        <AnimatePresence>
          <motion.h2
            layout="position"
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
        imageOption1={{
          src: imageOption1?.imageUrl ?? "",
          alt: `Image option 1 with the prompt: ${imagePrompt}`,
        }}
        imageOption2={{
          src: imageOption2?.imageUrl ?? "",
          alt: `Image option 2 with the prompt: ${imagePrompt}`,
        }}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
      />
      <AnimatePresence>
        {!imagesLoaded && (
          <>
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
                  maxLength={400}
                  name="prompt"
                  className="peer w-full resize-none rounded-xl border-2 border-gray-300 bg-transparent p-4 placeholder-transparent focus:border-indigo-600 focus:outline-none focus:dark:border-indigo-300"
                  defaultValue={imagePrompt ?? undefined}
                  required
                />
                <label
                  htmlFor="prompt"
                  className="absolute -top-6 left-2 text-sm text-gray-600 transition-all peer-placeholder-shown:left-4 peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-6 peer-focus:left-2 peer-focus:text-sm peer-focus:text-gray-600 dark:text-gray-400 dark:peer-focus:text-gray-400"
                >
                  Describe a funny image
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Button type="submit" disabled={loading}>
                  {!loading ? "Submit Prompt" : <Ellipsis />}
                </Button>
                <button
                  type="button"
                  className="transform text-2xl transition hover:scale-110"
                  onClick={() => dialogRef.current?.showModal()}
                >
                  <FiHelpCircle />
                </button>
              </div>
            </motion.form>
            <dialog
              ref={dialogRef}
              className="open:animate-modal open:backdrop:animate-modal relative mx-auto w-full max-w-2xl rounded-xl p-8 transition backdrop:bg-slate-900/50"
            >
              <form method="dialog">
                <button className="absolute right-2 top-2">
                  <FiX />
                </button>
                <p>
                  In Artificial Unintelligence, you can imagine any sort of
                  fantastical scene and create a depiction of it by entering in
                  a textual description of what the image should contain, known
                  as a &quot;prompt.&quot;
                </p>
                <br />
                <p className="mb-2">
                  Here are some suggestions on how to get started writing a
                  prompt of your own:
                </p>
                <ol className="flex list-decimal flex-col gap-2 pl-8">
                  <li>
                    The basis for a good prompt requires at least one subject
                    (nouns) and a couple of descriptors (adjectives and adverbs){" "}
                    <cite>
                      <a
                        href="https://letsenhance.io/blog/article/ai-text-prompt-guide/"
                        className="text-indigo-500 underline"
                      >
                        (source)
                      </a>
                    </cite>
                    . An example prompt could be &quot;A dog breathing blue fire
                    onto a plate of chicken nuggets.&quot;
                  </li>
                  <li>
                    To further enhance an image, try adding
                    &quot;aesthetic&quot; words to your prompt. These can be
                    keywords like &quot;cinematic,&quot;&quot;renaissance
                    painting,&quot; or &quot;vaporwave&quot;{" "}
                    <cite>
                      <a
                        href="https://letsenhance.io/blog/article/ai-text-prompt-guide/"
                        className="text-indigo-500 underline"
                      >
                        (source)
                      </a>
                    </cite>
                    . We can add an aesthetic word to our previous prompt so
                    that it says, &quot;A dog breathing blue fire onto a plate
                    of chicken nuggets, cinematic.&quot;
                  </li>
                  <li>
                    Try not to overdo the description, you can only input a
                    maximum of 400 characters (about 60 words) since this is the
                    max the image generator allows.
                  </li>
                </ol>
                <Button className="mt-8">Okay, I got it</Button>
              </form>
            </dialog>
          </>
        )}
        {imagesLoaded && (
          <div className="mt-4">
            <p className="mb-8">{imagePrompt}</p>
            <div className="fixed bottom-4 left-0 right-0 mx-auto flex w-full max-w-2xl gap-x-2 gap-y-4 px-6 md:static md:px-0">
              <Button
                className="w-full shadow-lg md:w-auto"
                onClick={onImageSubmit}
                disabled={!selectedImage || loading}
              >
                {!loading ? "Submit Image" : <Ellipsis />}
              </Button>
              <SecondaryButton
                className="w-full shadow-lg md:w-auto"
                onClick={onTryAnotherPrompt}
                disabled={loading || outOfRegenerations}
              >
                {!loading ? (
                  `Create New Images
                      ${remainingImageGenerations}/${maxRegenerations}`
                ) : (
                  <Ellipsis />
                )}
              </SecondaryButton>
            </div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Prompt;
