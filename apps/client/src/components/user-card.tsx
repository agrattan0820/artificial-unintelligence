/* eslint-disable @next/next/no-img-element */
// Disable @next/next/no-img-element because it breaks dicebear's image randomization

import { cn } from "@ai/utils/cn";

type UserCardProps = {
  nickname: string;
  color: "GRAY" | "INDIGO";
  isHost?: boolean;
  isYou?: boolean;
};

const UserCard = ({ nickname, color, isHost, isYou }: UserCardProps) => {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border-2 bg-slate-900 p-4",
        color === "INDIGO" ? "border-indigo-600" : "border-gray-300",
      )}
    >
      <span
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full border-2 p-1 md:h-12 md:w-12",
          color === "INDIGO" ? "border-indigo-600" : "border-gray-300",
        )}
      >
        <img
          src={`https://api.dicebear.com/7.x/bottts/svg?seed=${nickname
            .split(" ")
            .join("_")}`}
          alt={`Avatar for ${nickname}`}
          width={36}
          height={36}
        />
      </span>
      <span className="flex flex-col md:text-xl">
        {nickname}
        {isHost && <span className="text-xs">{"host"}</span>}
        {isYou && <span className="text-xs">{"you"}</span>}
      </span>
    </div>
  );
};

export default UserCard;
