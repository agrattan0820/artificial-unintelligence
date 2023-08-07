"use client";

import { motion } from "framer-motion";
import { FiCheck } from "react-icons/fi";

import { cn } from "@ai/utils/cn";
import { GameInfo } from "@ai/app/server-actions";
import { StateFrom } from "xstate";
import { gameMachine } from "./game-machine";
import { useStore } from "@ai/utils/store";
import Friend from "./friend";

type PlayerBlockProps = {
  nickname: string;
  submitted: boolean;
};

const PlayerBlock = ({ nickname, submitted }: PlayerBlockProps) => {
  return (
    <motion.li
      layout
      className={cn(
        "rounded-xl border-2 border-indigo-600 p-4 shadow-md",
        !submitted && "opacity-50"
      )}
    >
      <motion.p
        layout
        className="flex items-center justify-center gap-2 text-sm"
      >
        <motion.span layout="position">{nickname}</motion.span>{" "}
        {submitted && (
          <motion.span
            layout
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="block rounded-full bg-green-600 p-0.5 text-lg text-white"
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
  submittedPlayerIds,
}: {
  gameInfo: GameInfo;
  state: StateFrom<typeof gameMachine>;
  submittedPlayerIds: Set<number>;
}) => {
  const { user } = useStore();

  return (
    <div className="mx-auto text-center">
      <Friend className="mb-4 w-32 mx-auto" />
      <h2 className="mb-10 text-2xl md:text-4xl">We got your images!</h2>
      <p className="mb-6 text-sm md:text-lg">
        Waiting on your fellow AI trainers to submit.
      </p>
      <motion.ul
        layout
        className="mb-4 flex flex-wrap items-center justify-center gap-6"
      >
        {gameInfo.players.map((player, i) => (
          <PlayerBlock
            key={i}
            nickname={player.nickname}
            submitted={
              submittedPlayerIds.has(player.id) || player.id === user?.id
            }
          />
        ))}
      </motion.ul>
    </div>
  );
};

export default PromptSubmitted;
