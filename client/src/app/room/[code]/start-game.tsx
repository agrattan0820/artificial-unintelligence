"use client";

import Button, { SecondaryButton } from "@ai/components/button";
import useIsMounted from "@ai/utils/hooks/use-is-mounted";
import useShare from "@ai/utils/hooks/use-share";
import { useStore } from "@ai/utils/store";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiCheckSquare, FiPlusSquare, FiPlay } from "react-icons/fi";

const StartGame = ({ code }: { code: string }) => {
  const { players } = useStore();
  const { copying, setCopying, onClick } = useShare(`/invite/${code}`, () =>
    toast("Invite Link Copied to Clipboard")
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
    <div className="mt-8 flex items-center justify-center gap-2">
      {players.length > 1 && (
        <Button className="flex items-center gap-2">
          Start Game <FiPlay />
        </Button>
      )}
      <SecondaryButton onClick={onClick} className="flex items-center gap-2">
        Invite Players {copying ? <FiCheckSquare /> : <FiPlusSquare />}
      </SecondaryButton>
    </div>
  );
};

export default StartGame;
