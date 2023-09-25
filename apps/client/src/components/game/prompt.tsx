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
import useSound from "use-sound";
import type { Session } from "next-auth";

import Button, { SecondaryButton } from "@ai/components/button";
import Ellipsis from "@ai/components/ellipsis";
import ImageChoice, { ImageOption } from "./image-choice";
import {
  GameInfo,
  createGenerations,
  generateSDXLImages,
} from "@ai/utils/queries";
import { gameMachine } from "./game-machine";
import { SocketContext } from "@ai/utils/socket-provider";
import { SoundContext } from "@ai/utils/sound-provider";

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
  session,
}: {
  gameInfo: GameInfo;
  state: StateFrom<typeof gameMachine>;
  send: (event: EventFrom<typeof gameMachine>) => StateFrom<typeof gameMachine>;
  session: Session;
}) => {
  const socket = useContext(SocketContext);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { soundEnabled } = useContext(SoundContext);
  const [play] = useSound("/sounds/confirmation.ogg", { soundEnabled });

  const gameId = gameInfo.game.id;
  const userId = session.user.id;
  const currRound = state.context.round;
  const maxRegenerations = 2;

  const userGameRoundGenerations = gameInfo.gameRoundGenerations.filter(
    (generation) =>
      generation.user.id === userId && generation.question.round === currRound,
  );

  const isSecondStage =
    userGameRoundGenerations.length > 1 &&
    userGameRoundGenerations.some(
      (generation) => generation.generation.selected,
    );
  const shouldShowGenerations =
    userGameRoundGenerations.length > 1 &&
    !userGameRoundGenerations[0]?.generation.selected &&
    !userGameRoundGenerations[1]?.generation.selected;

  const [stage, setStage] = useState<"FIRST" | "SECOND">(
    isSecondStage ? "SECOND" : "FIRST",
  );
  const [loading, setLoading] = useState(false);
  const [imagePrompt, setImagePrompt] = useState(
    shouldShowGenerations ? userGameRoundGenerations[0].generation.text : "",
  );
  const [imageOption1, setImageOption1] = useState(
    shouldShowGenerations ? userGameRoundGenerations[1].generation : undefined,
  );
  const [imageOption2, setImageOption2] = useState(
    shouldShowGenerations ? userGameRoundGenerations[0].generation : undefined,
  );
  const [selectedImage, setSelectedImage] = useState<ImageOption>();

  const imagesLoaded = imageOption1 && imageOption2;

  const questions = useMemo(() => {
    return gameInfo.questions.filter((question) => {
      return (
        question.round === currRound &&
        (question.player1 === userId || question.player2 === userId)
      );
    });
  }, [currRound, gameInfo.questions, userId]);
  const currQuestion = stage === "FIRST" ? questions[0] : questions[1];

  const [currQuestionNumGenerations, setCurrQuestionNumGenerations] = useState(
    userGameRoundGenerations.filter(
      (generation) => generation.question.id === currQuestion.id,
    ).length,
  );

  const remainingImageGenerations =
    maxRegenerations - (currQuestionNumGenerations - 2) / 2;
  const outOfRegenerations = remainingImageGenerations === 0;

  const onPromptSubmit = async (e: FormEvent<PromptFormType>) => {
    e.preventDefault();
    setLoading(true);

    const formPrompt = e.currentTarget.elements.prompt.value;
    setImagePrompt(formPrompt);

    console.time("Execution Time");

    const images = await generateSDXLImages(formPrompt);

    console.timeEnd("Execution Time");

    if (images && Array.isArray(images) && images.length === 2) {
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

        setCurrQuestionNumGenerations(
          currQuestionNumGenerations + generations.length,
        );
      }
    } else {
      console.error("Images were unable to be generated");
      toast.error("I'm afraid I don't know how to process such a request.");
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

    if (session && imageOption1 && imageOption2) {
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
      setCurrQuestionNumGenerations(0);
      setStage("SECOND");
      setImagePrompt("");
      resetImage();
    } else {
      if (soundEnabled) {
        play();
      }
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
      <div className="relative mb-14">
        <AnimatePresence>
          <motion.div
            layout="position"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
          >
            <p className="mb-4 text-sm">
              Question {stage === "FIRST" ? 1 : 2}/2
            </p>
            <h2 className="text-lg md:text-2xl">
              {currQuestion ? currQuestion.text : null}
            </h2>
          </motion.div>
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
        loading={loading}
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
                {!loading ? (
                  <>
                    <textarea
                      id="prompt"
                      placeholder="Describe a funny image"
                      rows={5}
                      cols={33}
                      maxLength={400}
                      name="prompt"
                      className="peer w-full resize-none rounded-xl border-2 border-gray-300 bg-transparent p-4 placeholder-transparent focus:border-indigo-300 focus:outline-none"
                      defaultValue={imagePrompt ?? undefined}
                      required
                      disabled={loading}
                    />
                    <label
                      htmlFor="prompt"
                      className="absolute -top-6 left-2 text-sm text-gray-400 transition-all peer-placeholder-shown:left-4 peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-6 peer-focus:left-2 peer-focus:text-sm peer-focus:text-gray-400"
                    >
                      Describe a funny image
                    </label>
                  </>
                ) : (
                  <p className="mt-4">{imagePrompt}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button type="submit" disabled={loading}>
                  {!loading ? "Generate Images" : <Ellipsis />}
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
              className="relative mx-auto w-full max-w-2xl rounded-xl p-8 transition backdrop:bg-slate-900/50 open:animate-modal open:backdrop:animate-modal"
            >
              <form method="dialog">
                <button className="absolute right-4 top-4 text-xl md:text-2xl">
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
            <div className="fixed bottom-8 left-0 right-0 mx-auto flex w-full max-w-2xl gap-x-2 gap-y-4 px-6 md:static md:px-0">
              <Button
                className="w-full shadow-lg md:w-auto"
                onClick={onImageSubmit}
                disabled={!selectedImage || loading}
              >
                {loading ? (
                  <Ellipsis />
                ) : !selectedImage ? (
                  "Select an Image"
                ) : (
                  "Submit Image"
                )}
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
