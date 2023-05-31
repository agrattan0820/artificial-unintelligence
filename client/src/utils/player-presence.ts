"use client";

import { useEffect } from "react";
import supabase from "./supabase";
import { User } from "@ai/types/api.type";
import { useStore } from "./store";

export default function PlayerPresence({ code }: { code: string }) {
  const { user, setPlayers } = useStore();

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

        const newPlayerState = Object.values(state).flatMap((player) => {
          if ("user" in player[0]) {
            return player[0].user as User;
          }
          return [];
        });

        setPlayers(newPlayerState);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          const presenceTrackStatus = await channel.track({
            user: user ?? undefined,
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
  }, [code, setPlayers, user]);

  return null;
}
