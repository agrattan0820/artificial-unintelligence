"use client";

import Image from "next/image";

import { AnimatePresence, motion } from "framer-motion";
import { FiUser } from "react-icons/fi";

import { User } from "@ai/app/server-actions";
import { cn } from "@ai/utils/cn";
import UserCard from "@ai/components/user-card";

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
