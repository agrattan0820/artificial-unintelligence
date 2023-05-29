"use client";

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import supabase from "@ai/utils/supabase";
import { useStore } from "@ai/utils/store";

const UserCount = ({
  code,
  initialCount,
}: {
  code: string;
  initialCount: number;
}) => {
  const [userCount, setUserCount] = useState(initialCount);
  const { user, room, players } = useStore();

  console.log("USER", user);
  console.log("ROOM", room);
  console.log("PLAYERS", players);

  useEffect(() => {
    const channel = supabase.channel(code, {
      config: {
        presence: {
          key: user?.id.toLocaleString() ?? undefined,
        },
      },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        console.log("[PRESENCE STATE]:", state);

        setUserCount(Object.keys(state).length);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          const presenceTrackStatus = await channel.track({
            user: user?.id ?? undefined,
            online_at: new Date().toISOString(),
          });

          console.log("[PRESENCE TRACK STATUS]:", presenceTrackStatus);
        }

        if (status === "CLOSED") {
          const presenceUntrackStatus = await channel.untrack();
          console.log("[PRESENCE UNTRACK STATUS]:", presenceUntrackStatus);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [code, user?.id]);

  return (
    <div className="rounded-xl border border-gray-300 p-4">
      <p>{userCount.toLocaleString()} / 8 Players</p>
    </div>
  );
};

export default UserCount;
