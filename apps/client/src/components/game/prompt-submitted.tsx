/* eslint-disable @next/next/no-img-element */
// Disable @next/next/no-img-element because it breaks dicebear's image randomization

"use client";

import { motion } from "framer-motion";
import { FiCheck } from "react-icons/fi";
import { Session } from "next-auth";

import { cn } from "@ai/utils/cn";
import { GameInfo } from "@ai/utils/queries";
import Friend from "./friend";

type SubmittedUserCardProps = {
  nickname: string;
  submitted: boolean;
};

const SubmittedUserCard = ({ nickname, submitted }: SubmittedUserCardProps) => {
  return (
    <motion.li
      layout
      className={cn(
        "rounded-xl border-2 border-indigo-600 p-4",
        !submitted && "opacity-50",
      )}
    >
      <motion.p
        layout
        className="flex items-center justify-center gap-3 md:text-xl"
      >
        <motion.span
          layout="position"
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full border-2 border-indigo-600 p-1",
          )}
        >
          <img
            src={`https://api.dicebear.com/7.x/bottts/svg?seed=${nickname
              .split(" ")
              .join("_")}&size=36`}
            alt={`Avatar for ${nickname}`}
            width={36}
            height={36}
          />
        </motion.span>
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
  submittedPlayerIds,
  session,
}: {
  gameInfo: GameInfo;
  submittedPlayerIds: Set<string>;
  session: Session;
}) => {
  return (
    <div className="mx-auto text-center">
      <Friend className="mx-auto mb-4 w-32" />
      <h2 className="mb-10 text-2xl md:text-4xl">We got your images!</h2>
      <p className="mb-6 text-sm md:text-lg">
        Waiting on your fellow AI trainers to submit.
      </p>
      <motion.ul
        layout
        className="mb-4 flex flex-wrap items-center justify-center gap-6"
      >
        {gameInfo.players.map((player, i) => (
          <SubmittedUserCard
            key={i}
            nickname={player.nickname}
            submitted={
              submittedPlayerIds.has(player.id) || player.id === session.user.id
            }
          />
        ))}
      </motion.ul>
    </div>
  );
};

export default PromptSubmitted;
