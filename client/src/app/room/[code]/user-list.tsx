"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FiUser } from "react-icons/fi";

import { User } from "@ai/app/server-actions";
import { cn } from "@ai/utils/cn";

const UserList = ({
  hostId,
  players,
}: {
  hostId: number | null;
  players: User[];
}) => {
  return (
    <motion.ul
      layout
      className="mx-auto mt-8 flex max-w-lg flex-wrap items-center justify-center gap-3"
    >
      <AnimatePresence>
        {players.map((player, i) => (
          <motion.li
            layout="position"
            key={i}
            className={cn(
              "flex items-center gap-3 rounded-xl border-2 bg-slate-900 p-4",
              player.id === hostId ? "border-indigo-600" : "border-gray-300"
            )}
          >
            <motion.span className="rounded-full border-2 border-black">
              <FiUser className="text-2xl" />
            </motion.span>
            <motion.span className="flex flex-col md:text-xl">
              {player.nickname}
              <span className="text-xs">{player.id === hostId && "host"}</span>
            </motion.span>
          </motion.li>
        ))}
      </AnimatePresence>
    </motion.ul>
  );
};

export default UserList;
