"use client";

import { FiCheck, FiCopy } from "react-icons/fi";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import useIsMounted from "@ai/utils/hooks/use-is-mounted";

const RoomLink = ({ code }: { code: string }) => {
  const pathname = usePathname();
  const [copying, setCopying] = useState(false);
  const isMounted = useIsMounted();

  const inviteLink = isMounted
    ? `${window.location.origin}/invite/${code}`
    : "";

  const onShareClick = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `GradeMyAid Rating`,
          url: typeof window !== "undefined" ? inviteLink : "",
        })
        .then(() => {
          console.log(`Thanks for sharing!`);
        })
        .catch(console.error);
    } else {
      const cb = navigator.clipboard;
      if (copying) {
        setCopying(false);
      }
      cb.writeText(typeof window !== "undefined" ? inviteLink : "")
        .then(() => {
          setCopying(true);
        })
        .catch(console.error);
    }
  };

  useEffect(() => {
    if (copying) {
      const timer = setTimeout(() => setCopying(false), 2000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [copying]);

  return (
    <button
      className="mx-auto flex w-full max-w-xl items-center justify-center gap-1 rounded-xl border-2 border-indigo-700 p-8 font-space text-xl underline-offset-2 hover:underline"
      onClick={onShareClick}
    >
      {inviteLink} {copying ? <FiCheck /> : <FiCopy />}
    </button>
  );
};

export default RoomLink;
