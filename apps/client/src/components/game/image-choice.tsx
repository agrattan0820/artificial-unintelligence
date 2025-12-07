/* eslint-disable @next/next/no-img-element */
"use client";

import { Variants, motion } from "framer-motion";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FiCheck } from "react-icons/fi";

import { cn } from "@ai/utils/cn";

export type ImageOption = 1 | 2;

type ImageChoiceProps = {
  imageOption1: { src: string; alt: string };
  imageOption2: { src: string; alt: string };
  selectedImage: ImageOption | undefined;
  setSelectedImage: Dispatch<SetStateAction<ImageOption | undefined>>;
  loading?: boolean;
  disabled?: boolean;
};

/**
 * Skeleton component taken from Delba's fantastic blog post
 * https://delba.dev/blog/animated-loading-skeletons-with-tailwind
 */
const SkeletonImage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative isolate aspect-square min-h-[324px] w-full min-w-[324px] overflow-hidden rounded-xl bg-slate-800 shadow-xl shadow-black/5 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:border-t before:border-slate-100/10 before:bg-linear-to-r before:from-transparent before:via-slate-700 before:to-transparent"
    />
  );
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
  if (!image.src) {
    return <SkeletonImage />;
  }

  return (
    <motion.div
      initial="hidden"
      animate={bothShown ? "visible" : "hidden"}
      variants={variants}
    >
      <button
        className="group relative rounded-xl transition hover:ring hover:ring-indigo-600 disabled:hover:ring-0"
        disabled={disabled ?? !showImage}
        onClick={onClick}
      >
        <img
          className="aspect-square rounded-xl transition group-hover:brightness-105 group-focus-visible:brightness-105 group-disabled:group-hover:brightness-100 group-disabled:group-focus-visible:brightness-100"
          src={image.src}
          alt={image.alt}
          onLoad={onLoad}
          width={768}
          height={768}
          loading="eager"
        />
        <FiCheck
          className={cn(
            "absolute -top-2 -right-2 scale-0 transform rounded-full bg-green-600 p-0.5 text-3xl text-white transition",
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
  loading,
  disabled,
}: ImageChoiceProps) => {
  const [showImage1, setShowImage1] = useState(false);
  const [showImage2, setShowImage2] = useState(false);

  const bothShown = showImage1 && showImage2;

  useEffect(() => {
    if (!imageOption1) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentionally resetting state when image is cleared
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
      {(loading || imageOption1.src) && (
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
      {(loading || imageOption2.src) && (
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
