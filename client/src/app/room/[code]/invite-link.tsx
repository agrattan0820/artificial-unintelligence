"use client";

import { useEffect } from "react";
import { FiCheckSquare, FiCopy } from "react-icons/fi";

import useShare from "@ai/utils/hooks/use-share";

const InviteLink = ({ code }: { code: string }) => {
  const { link, copying, setCopying, onClick } = useShare(`/invite/${code}`);

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
      className="mx-auto flex w-full max-w-xl items-center justify-center gap-2 rounded-xl border-2 border-indigo-600 p-8 text-sm underline-offset-2 hover:underline md:text-xl"
      onClick={onClick}
    >
      {link}
      <span className="hidden md:inline-block">
        {copying ? <FiCheckSquare /> : <FiCopy />}
      </span>
    </button>
  );
};

export default InviteLink;
