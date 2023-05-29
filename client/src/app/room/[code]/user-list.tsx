"use client";

import { cn } from "@ai/utils/cn";
import useIsMounted from "@ai/utils/hooks/use-is-mounted";
import { useStore } from "@ai/utils/store";
import { FiLoader, FiUser } from "react-icons/fi";

const UserList = () => {
  const { user, players } = useStore();
  const isMounted = useIsMounted();

  return (
    <div className="mx-auto mt-8 flex max-w-lg flex-wrap items-center justify-center gap-2 font-space">
      {isMounted ? (
        players.map((player, i) => (
          <div
            key={i}
            className={cn(
              "flex items-center gap-3 rounded-xl border-2 p-4",
              player.id === user?.id ? "border-indigo-200" : "border-gray-300"
            )}
          >
            <div className="rounded-full border-2 border-black">
              <FiUser className="text-2xl" />
            </div>
            <span className="text-xl">{player.nickname}</span>
          </div>
        ))
      ) : (
        <FiLoader className="text-xl" />
      )}
    </div>
  );
};

export default UserList;
