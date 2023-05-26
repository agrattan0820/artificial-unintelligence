"use client";

import useIsMounted from "@ai/utils/hooks/use-is-mounted";
import { socket } from "@ai/utils/socket";
import clsx from "clsx";
import { useEffect, useState } from "react";

const ConnectionStatus = () => {
  const isMounted = useIsMounted();
  const [isConnected, setIsConnected] = useState(socket.connected ?? false);

  useEffect(() => {
    const turnOnConnection = () => {
      setIsConnected(true);
    };

    const turnOffConnection = () => {
      setIsConnected(false);
    };

    socket.on("connect", turnOnConnection);
    socket.on("disconnect", turnOffConnection);

    return () => {
      socket.off("connect", turnOnConnection);
      socket.off("disconnect", turnOffConnection);
    };
  }, []);

  return (
    <div
      className={clsx(
        "absolute right-8 top-8 rounded-xl p-4 font-space text-white",
        isMounted && isConnected ? "bg-emerald-700" : "bg-red-700"
      )}
    >
      {isMounted && isConnected ? "Connected" : "Disconnected"}
    </div>
  );
};

export default ConnectionStatus;
