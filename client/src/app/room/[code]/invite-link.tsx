"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";
import { FiCheckSquare, FiCopy } from "react-icons/fi";

import useShare from "@ai/utils/hooks/use-share";

const InviteLink = ({ code }: { code: string }) => {
  const { link, copying, setCopying, onClick } = useShare(
    `/invite/${code}`,
    () => toast("Invite Link Copied to Clipboard")
  );

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
      className="mx-auto flex w-full items-center justify-center gap-2 rounded-xl border-2 border-indigo-600 p-8 text-xl underline-offset-2 hover:underline sm:w-auto"
      onClick={onClick}
    >
      <span className="sm:hidden">{code}</span>
      <span className="hidden sm:inline-block">{link}</span>
      <span>{copying ? <FiCheckSquare /> : <FiCopy />}</span>
    </button>
  );
};

export default InviteLink;
