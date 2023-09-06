"use client";

import { AnimatePresence, motion } from "framer-motion";

import { User } from "@ai/app/server-actions";
import UserCard from "@ai/components/user-card";

const UserList = ({
  hostId,
  players,
}: {
  hostId: string | null;
  players: User[];
}) => {
  return (
    <motion.ul
      layout
      className="mx-auto mt-8 flex max-w-lg flex-wrap items-center justify-center gap-3"
    >
      <AnimatePresence>
        {players.map((player, i) => (
          <motion.li layout="position" key={i}>
            <UserCard
              nickname={player.nickname}
              color={player.id === hostId ? "INDIGO" : "GRAY"}
              isHost={player.id === hostId}
            />
          </motion.li>
        ))}
      </AnimatePresence>
    </motion.ul>
  );
};

export default UserList;
