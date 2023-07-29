"use client";

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
    <ul className="mx-auto mt-8 flex max-w-lg flex-wrap items-center justify-center gap-3">
      {players.map((player, i) => (
        <li
          key={i}
          className={cn(
            "flex items-center gap-3 rounded-xl border-2 p-4",
            player.id === hostId ? "border-indigo-600" : "border-gray-300"
          )}
        >
          <span className="rounded-full border-2 border-black">
            <FiUser className="text-2xl" />
          </span>
          <span className="flex flex-col text-xl">
            {player.nickname}
            <span className="text-xs">{player.id === hostId && "host"}</span>
          </span>
        </li>
      ))}
    </ul>
  );
};

export default UserList;
