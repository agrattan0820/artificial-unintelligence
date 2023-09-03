"use client";

import { motion } from "framer-motion";

type AnnouncementTextProps = {
  text: string;
};

const AnnouncementText = ({ text }: AnnouncementTextProps) => {
  return (
    <div className="text-center">
      <motion.h2
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="text-3xl md:text-5xl"
      >
        {text}
      </motion.h2>
    </div>
  );
};

export default AnnouncementText;
