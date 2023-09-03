"use client";

import { Variants, motion } from "framer-motion";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Image from "next/image";
import { FiCheck } from "react-icons/fi";

import { cn } from "@ai/utils/cn";

export type ImageOption = 1 | 2;

type ImageChoiceProps = {
  imageOption1: { src: string; alt: string };
  imageOption2: { src: string; alt: string };
  selectedImage: ImageOption | undefined;
  setSelectedImage: Dispatch<SetStateAction<ImageOption | undefined>>;
  disabled?: boolean;
};

const ImageChoiceOption = ({
  image,
  option,
  onClick,
  onLoad,
  disabled,
  variants,
  showImage,
  bothShown,
  selectedImage,
}: {
  image: { src: string; alt: string };
  option: ImageOption;
  onClick: () => void;
  onLoad: () => void;
  disabled: boolean | undefined;
  variants: Variants;
  showImage: boolean;
  bothShown: boolean;
  selectedImage: ImageOption | undefined;
}) => {
  return (
    <motion.div
      initial={false}
      animate={bothShown ? "visible" : "hidden"}
      variants={variants}
    >
      <button
        className="group relative rounded-xl transition hover:ring hover:ring-indigo-600 disabled:hover:ring-0"
        disabled={disabled ?? !showImage}
        onClick={onClick}
      >
        <Image
          className="aspect-square rounded-xl transition group-hover:brightness-105 group-focus-visible:brightness-105 group-disabled:group-hover:brightness-100 group-disabled:group-focus-visible:brightness-100"
          src={image.src}
          alt={image.alt}
          onLoad={onLoad}
          width={1024}
          height={1024}
        />
        <FiCheck
          className={cn(
            "absolute -right-2 -top-2 scale-0 transform rounded-full bg-green-600 p-0.5 text-3xl text-white transition",
            selectedImage === option && "scale-100",
          )}
        />
      </button>
    </motion.div>
  );
};

const ImageChoice = ({
  imageOption1,
  imageOption2,
  selectedImage,
  setSelectedImage,
  disabled,
}: ImageChoiceProps) => {
  const [showImage1, setShowImage1] = useState(false);
  const [showImage2, setShowImage2] = useState(false);

  const bothShown = showImage1 && showImage2;

  useEffect(() => {
    if (!imageOption1) {
      setShowImage1(false);
    }
    if (!imageOption2) {
      setShowImage2(false);
    }
  }, [imageOption1, imageOption2]);

  const image1Variants: Variants = {
    hidden: {
      opacity: 0,
      y: -15,
    },
    visible: {
      opacity: 1,
      y: 0,
    },
  };
  const image2Variants: Variants = {
    hidden: {
      opacity: 0,
      y: -15,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3,
      },
    },
  };

  return (
    <div className="flex flex-col gap-6 md:flex-row">
      {imageOption1.src && (
        <ImageChoiceOption
          image={imageOption1}
          option={1}
          onClick={() => setSelectedImage(1)}
          onLoad={() => setShowImage1(true)}
          disabled={disabled}
          variants={image1Variants}
          showImage={showImage1}
          bothShown={bothShown}
          selectedImage={selectedImage}
        />
      )}
      {imageOption2.src && (
        <ImageChoiceOption
          image={imageOption2}
          option={2}
          onClick={() => setSelectedImage(2)}
          onLoad={() => setShowImage2(true)}
          disabled={disabled}
          variants={image2Variants}
          showImage={showImage2}
          bothShown={bothShown}
          selectedImage={selectedImage}
        />
      )}
    </div>
  );
};

export default ImageChoice;
