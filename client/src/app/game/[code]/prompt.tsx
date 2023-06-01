"use client";

import { FormEvent, useState } from "react";
import Button from "@ai/components/button";
import { generateImage } from "@ai/utils/query";
import Ellipsis from "@ai/components/ellipsis";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@ai/utils/cn";
import { FiCheck } from "react-icons/fi";

interface FormElementsType extends HTMLFormControlsCollection {
  prompt: HTMLInputElement;
}

export interface PromptFormType extends HTMLFormElement {
  readonly elements: FormElementsType;
}

type ImageOption = 1 | 2;

const Prompt = () => {
  const [loading, setLoading] = useState(false);
  const [imageOption1, setImageOption1] = useState("");
  const [imageOption2, setImageOption2] = useState("");
  const [showImage1, setShowImage1] = useState(false);
  const [showImage2, setShowImage2] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageOption>();

  const onSubmit = async (e: FormEvent<PromptFormType>) => {
    e.preventDefault();
    setLoading(true);
    const formPrompt = e.currentTarget.elements.prompt.value;

    const images = await generateImage(formPrompt);

    if (!images) {
      console.error("Images were unable to be generated");
    } else {
      setImageOption1(images[0].url ?? "");
      setImageOption2(images[1].url ?? "");
    }

    setLoading(false);
  };

  return (
    <motion.div layout className="max-w-2xl">
      <h2 className="mb-14 text-lg md:text-2xl">
        Make a funny{" "}
        <span className="text-indigo-700 dark:text-indigo-300">Dog</span>{" "}
        picture for me human
      </h2>
      <div className="mb-16 flex gap-6">
        <AnimatePresence>
          {imageOption1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <button className="relative" onClick={() => setSelectedImage(1)}>
                <Image
                  className={cn(
                    `aspect-square rounded-xl opacity-0 transition`,
                    showImage1 && "opacity-100",
                    selectedImage === 1 && "ring ring-indigo-600"
                  )}
                  src={imageOption1}
                  alt="OpenAI Image"
                  onLoad={() => setShowImage1(true)}
                  width={1024}
                  height={1024}
                />
                <FiCheck
                  className={cn(
                    "absolute -right-2 -top-2 scale-0 transform rounded-full bg-green-600 p-0.5 text-xl text-white transition",
                    selectedImage === 1 && "scale-100"
                  )}
                />
              </button>
            </motion.div>
          )}
          {imageOption2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <button className="relative" onClick={() => setSelectedImage(2)}>
                <Image
                  className={cn(
                    `aspect-square rounded-xl opacity-0 transition`,
                    showImage2 && "opacity-100",
                    selectedImage === 2 && "ring ring-indigo-600"
                  )}
                  src={imageOption2}
                  alt="OpenAI Image"
                  onLoad={() => setShowImage2(true)}
                  width={1024}
                  height={1024}
                />
                <FiCheck
                  className={cn(
                    "absolute -right-2 -top-2 scale-0 transform rounded-full bg-green-600 p-0.5 text-xl text-white transition",
                    selectedImage === 2 && "scale-100"
                  )}
                />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <form onSubmit={onSubmit}>
        <div className="relative mb-8">
          <textarea
            id="prompt"
            placeholder="Describe a funny image"
            rows={5}
            cols={33}
            maxLength={500}
            className="peer w-full resize-none rounded-xl border-2 border-gray-300 bg-transparent p-4 placeholder-transparent focus:border-indigo-600 focus:outline-none focus:dark:border-indigo-300"
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
      </form>
    </motion.div>
  );
};

export default Prompt;
