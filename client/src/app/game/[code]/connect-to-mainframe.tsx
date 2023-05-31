"use client";

import Image from "next/image";
import TypewriterText from "@ai/components/typewriter";

const ConnectToMainframe = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h2 className="mb-6 w-fit text-4xl">
        <TypewriterText>Connecting to the mainframe...</TypewriterText>
      </h2>
      <Image
        src="https://media.giphy.com/media/B4dt6rXq6nABilHTYM/giphy.gif"
        alt="Hacker man"
        width={498}
        height={469}
      />
    </div>
  );
};

export default ConnectToMainframe;
