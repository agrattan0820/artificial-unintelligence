"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";
import { FiCheckSquare, FiPlusSquare, FiPlay } from "react-icons/fi";
import type { Session } from "next-auth";
import type { User } from "database";

import Button, { SecondaryButton } from "@ai/components/button";
import Ellipsis from "@ai/components/ellipsis";
import useLinkShare from "@ai/utils/hooks/use-link-share";
import useIsMounted from "@ai/utils/hooks/use-is-mounted";

const StartGame = ({
  players,
  code,
  hostId,
  onStartGame,
  loading,
  roomIsFull,
  session,
}: {
  players: User[];
  code: string;
  hostId: string | null;
  onStartGame: () => void;
  loading: boolean;
  roomIsFull: boolean;
  session: Session;
}) => {
  const isMounted = useIsMounted();

  const { copying, setCopying, onClick } = useLinkShare({
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
    <>
      <div className="mt-8 flex flex-col items-center justify-center gap-x-2 gap-y-4 sm:flex-row">
        {isMounted &&
          players.length > 2 &&
          session &&
          session.user.id == hostId && (
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
        <SecondaryButton
          onClick={onClick}
          className="flex items-center gap-2"
          disabled={roomIsFull}
        >
          Invite Players {copying ? <FiCheckSquare /> : <FiPlusSquare />}
        </SecondaryButton>
      </div>

      <p className="mt-8 text-center text-xs">
        {!isMounted ? (
          <Ellipsis />
        ) : players.length <= 2 ? (
          `Need ${3 - players.length} more player${
            3 - players.length !== 1 ? "s" : ""
          } to start a game`
        ) : (
          session &&
          session.user.id !== hostId &&
          "Waiting on host to start game..."
        )}
      </p>
    </>
  );
};

export default StartGame;
