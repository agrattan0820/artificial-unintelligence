"use client";

import Image from "next/image";
import Ellipsis from "@ai/components/ellipsis";

const ConnectToMainframe = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h2 className="mb-6 text-4xl">
        <span className="mr-1.5">Connecting to the mainframe</span>
        <Ellipsis />
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
