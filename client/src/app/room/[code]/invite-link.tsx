"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";
import { FiCheckSquare, FiCopy } from "react-icons/fi";

import useLinkShare from "@ai/utils/hooks/use-link-share";

const InviteLink = ({ code }: { code: string }) => {
  const { link, copying, setCopying, onClick } = useLinkShare({
    title: "Join My Artificial Unintelligence Room",
    slug: `/invite/${code}`,
    callback: () => toast("Invite Link Copied to Clipboard"),
  });

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
      className="mx-auto hidden w-full items-center justify-center gap-2 rounded-xl border-2 border-indigo-600 p-8 text-xl underline-offset-2 hover:underline sm:flex sm:w-auto"
      onClick={onClick}
    >
      <span>{link}</span>
      <span>{copying ? <FiCheckSquare /> : <FiCopy />}</span>
    </button>
  );
};

export default InviteLink;
