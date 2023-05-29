"use client";

import { cn } from "@ai/utils/cn";
import useIsMounted from "@ai/utils/hooks/use-is-mounted";
import { useStore } from "@ai/utils/store";
import { FiLoader, FiUser } from "react-icons/fi";

const UserList = () => {
  const { user, players } = useStore();
  const isMounted = useIsMounted();

  return (
    <ul className="mx-auto mt-8 flex max-w-lg flex-wrap items-center justify-center gap-2">
      {isMounted ? (
        players.map((player, i) => (
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
        ))
      ) : (
        <FiLoader className="text-xl" />
      )}
    </ul>
  );
};

export default UserList;
