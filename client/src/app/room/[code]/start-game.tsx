"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";
import { FiCheckSquare, FiPlusSquare, FiPlay } from "react-icons/fi";

import { User } from "@ai/app/server-actions";
import Button, { SecondaryButton } from "@ai/components/button";
import Ellipsis from "@ai/components/ellipsis";
import useShare from "@ai/utils/hooks/use-share";

const StartGame = ({
  players,
  code,
  onStartGame,
  loading,
}: {
  players: User[];
  code: string;
  onStartGame: () => void;
  loading: boolean;
}) => {
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
      {players.length > 2 && (
        <Button onClick={onStartGame} className="flex items-center gap-2">
          {loading ? (
            <Ellipsis />
          ) : (
            <>
              Start Game <FiPlay />
            </>
          )}
        </Button>
      )}
      <SecondaryButton onClick={onClick} className="flex items-center gap-2">
        Invite Players {copying ? <FiCheckSquare /> : <FiPlusSquare />}
      </SecondaryButton>
    </div>
  );
};

export default StartGame;
