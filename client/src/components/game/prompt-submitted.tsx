"use client";

import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiCheck } from "react-icons/fi";

import { cn } from "@ai/utils/cn";
import Button from "@ai/components/button";
import FriendWithLegs from "./friend-with-legs";
import { GameInfo } from "@ai/app/server-actions";
import { StateFrom } from "xstate";
import { gameMachine } from "./game-machine";
import { SocketContext } from "@ai/utils/socket-provider";
import { useStore } from "@ai/utils/store";

type PlayerBlockProps = {
  nickname: string;
  submitted: boolean;
};

const PlayerBlock = ({ nickname, submitted }: PlayerBlockProps) => {
  return (
    <motion.li
      layout
      className={cn(
        "rounded-md bg-indigo-300 p-4 shadow-md",
        !submitted && "opacity-50"
      )}
    >
      <motion.p
        layout
        className="flex items-center justify-center gap-2 text-sm text-black"
      >
        <motion.span layout="position">{nickname}</motion.span>{" "}
        {submitted && (
          <motion.span
            layout
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="block rounded-full bg-white p-0.5 text-lg text-green-600"
          >
            <FiCheck />
          </motion.span>
        )}
      </motion.p>
    </motion.li>
  );
};

const PromptSubmitted = ({
  gameInfo,
  state,
  submittedPlayers,
}: {
  gameInfo: GameInfo;
  state: StateFrom<typeof gameMachine>;
  submittedPlayers: Set<number>;
}) => {
  const { user } = useStore();
  // const socket = useContext(SocketContext);

  return (
    <div className="mx-auto flex min-h-screen flex-col items-center justify-center text-center">
      <FriendWithLegs />
      <h2 className="mb-12 text-4xl">We Got Your Images!</h2>
      <p className="mb-6 text-lg">Waiting on your fellow testers to submit</p>
      <motion.ul
        layout
        className="mb-4 flex flex-wrap items-center justify-center gap-6"
      >
        {gameInfo.room.players.map((player, i) => (
          <PlayerBlock
            key={i}
            nickname={player.nickname}
            submitted={
              submittedPlayers.has(player.id) || player.id === user?.id
            }
          />
        ))}
      </motion.ul>
    </div>
  );
};

export default PromptSubmitted;
