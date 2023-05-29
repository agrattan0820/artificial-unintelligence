"use client";

import useIsMounted from "@ai/utils/hooks/use-is-mounted";
import supabase from "@ai/utils/supabase";
import { useEffect, useState } from "react";
import { cn } from "@ai/utils/cn";

const ConnectionStatus = ({ code }: { code: string }) => {
  const isMounted = useIsMounted();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const channel = supabase.channel(code);

    channel.on("presence", { event: "sync" }, () => {
      console.log("Online users: ", channel.presenceState());
      setIsConnected(true);
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [code]);

  return (
    <div
      className={cn(
        "absolute right-8 top-8 rounded-xl p-4 font-space text-white",
        isMounted && isConnected ? "bg-emerald-700" : "bg-red-700"
      )}
    >
      {isMounted && isConnected ? "Connected" : "Disconnected"}
    </div>
  );
};

export default ConnectionStatus;
