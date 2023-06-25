"use client";

import SadDog from "@ai/images/sad-dog.webp";
import SadDog2 from "@ai/images/sad-dog-2.webp";
import { motion } from "framer-motion";
import Button from "@ai/components/button";
import { useState } from "react";
import ImageChoice, { ImageOption } from "./image-choice";
import Ellipsis from "@ai/components/ellipsis";
import Timer from "./timer";

const FaceOff = () => {
  const [loading, setLoading] = useState(false);
  const [imageOption1, setImageOption1] = useState("");
  const [imageOption2, setImageOption2] = useState("");
  const [selectedImage, setSelectedImage] = useState<ImageOption>();

  const onImageChoice = async () => {};

  return (
    <div className="mx-auto max-w-2xl">
      <Timer totalSeconds={30} />
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
