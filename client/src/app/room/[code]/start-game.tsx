"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";
import { FiCheckSquare, FiPlusSquare, FiPlay } from "react-icons/fi";

import { User } from "@ai/app/server-actions";
import Button, { SecondaryButton } from "@ai/components/button";
import Ellipsis from "@ai/components/ellipsis";
import useShare from "@ai/utils/hooks/use-share";
import { useStore } from "@ai/utils/store";

const StartGame = ({
  players,
  code,
  hostId,
  onStartGame,
  loading,
}: {
  players: User[];
  code: string;
  hostId: number | null;
  onStartGame: () => void;
  loading: boolean;
}) => {
  const { user } = useStore();

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
    <>
      <div className="mt-8 flex items-center justify-center gap-2">
        {players.length > 2 && user && user.id == hostId && (
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
      <p className="mt-8 text-center text-xs">
        {players.length <= 2
          ? `Need ${3 - players.length} more player${
              3 - players.length !== 1 ? "s" : ""
            } to start a game`
          : user && user.id !== hostId && "Waiting on host to start game..."}
      </p>
    </>
  );
};

export default StartGame;
