"use client";

import { FiUser } from "react-icons/fi";

import { User } from "@ai/app/server-actions";
import { cn } from "@ai/utils/cn";

const UserList = ({ players }: { players: User[] }) => {
  return (
    <ul className="mx-auto mt-8 flex max-w-lg flex-wrap items-center justify-center gap-2">
      {players.map((player, i) => (
        <li
          key={i}
          className={cn(
            "flex items-center gap-3 rounded-xl border-2 border-gray-300 p-4"
            // TODO: show differences between current user and others?
            // player.id === user?.id ? "border-gray-200" : "border-gray-300"
          )}
        >
          <span className="rounded-full border-2 border-black">
            <FiUser className="text-2xl" />
          </span>
          <span className="text-xl">{player.nickname}</span>
        </li>
      ))}
    </ul>
  );
};

export default UserList;
