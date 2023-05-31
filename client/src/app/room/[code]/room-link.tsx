"use client";

import { FiCheckSquare, FiCopy } from "react-icons/fi";
import { useEffect } from "react";
import useShare from "@ai/utils/hooks/use-share";

const RoomLink = ({ code }: { code: string }) => {
  const { link, copying, setCopying, onClick } = useShare(`/invite/${code}`);

  console.log("hello");

  useEffect(() => {
    if (copying) {
      const timer = setTimeout(() => setCopying(false), 2000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [copying, setCopying]);

  return (
    <button
      className="mx-auto flex w-full max-w-xl items-center justify-center gap-1 rounded-xl border-2 border-indigo-600 p-8 text-xl underline-offset-2 hover:underline"
      onClick={onClick}
    >
      {link} {copying ? <FiCheckSquare /> : <FiCopy />}
    </button>
  );
};

export default RoomLink;
