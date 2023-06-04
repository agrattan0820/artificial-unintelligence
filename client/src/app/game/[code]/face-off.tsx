"use client";

import Image from "next/image";
import SadDog from "@ai/images/sad-dog.webp";
import SadDog2 from "@ai/images/sad-dog-2.webp";
import { motion } from "framer-motion";
import Button from "@ai/components/button";
import { useState } from "react";
import { ImageOption } from "./image-choice";
import Ellipsis from "@ai/components/ellipsis";
import { cn } from "@ai/utils/cn";
import { FiCheck } from "react-icons/fi";

const FaceOff = () => {
  const [loading, setLoading] = useState(false);
  const [imageOption1, setImageOption1] = useState("");
  const [imageOption2, setImageOption2] = useState("");
  const [selectedImage, setSelectedImage] = useState<ImageOption>();

  const imagesLoaded = imageOption1 && imageOption2;

  const onImageChoice = async () => {};

  return (
    <div className="mx-auto max-w-2xl">
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
      <div className="mb-14 flex gap-5">
        <motion.button
          initial={{ opacity: 0, x: -25, rotateZ: -15 }}
          animate={{ opacity: 1, x: 0, rotateZ: 0 }}
          exit={{ opacity: 0, x: -25, rotateZ: -15 }}
          transition={{ delay: 0.3 }}
          onClick={() => setSelectedImage(1)}
          className="relative"
        >
          <Image
            className={cn(
              `aspect-square rounded-xl`,
              selectedImage === 1 && "ring ring-indigo-600"
            )}
            src={SadDog}
            alt="Sad Dog"
            width={1024}
            height={1024}
          />
          <FiCheck
            className={cn(
              "absolute -right-2 -top-2 scale-0 transform rounded-full bg-green-600 p-0.5 text-xl text-white transition",
              selectedImage === 1 && "scale-100"
            )}
          />
        </motion.button>
        <motion.button
          initial={{ opacity: 0, x: 25, rotateZ: 15 }}
          animate={{ opacity: 1, x: 0, rotateZ: 0 }}
          exit={{ opacity: 0, x: 25, rotateZ: 15 }}
          transition={{ delay: 0.8 }}
          onClick={() => setSelectedImage(2)}
          className="relative"
        >
          <Image
            className={cn(
              `aspect-square rounded-xl`,
              selectedImage === 2 && "ring ring-indigo-600"
            )}
            src={SadDog2}
            alt="Sad Dog 2"
            width={1024}
            height={1024}
          />
          <FiCheck
            className={cn(
              "absolute -right-2 -top-2 scale-0 transform rounded-full bg-green-600 p-0.5 text-xl text-white transition",
              selectedImage === 2 && "scale-100"
            )}
          />
        </motion.button>
      </div>
      <div>
        <Button onClick={onImageChoice} disabled={!selectedImage || loading}>
          {!loading ? "Confirm Vote" : <Ellipsis />}
        </Button>
      </div>
    </div>
  );
};

export default FaceOff;
