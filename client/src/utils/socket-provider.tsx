"use client";

import { createContext, useEffect } from "react";
import toast from "react-hot-toast";

import { socket } from "./socket";
import { useStore } from "./store";

export const SocketContext = createContext(socket);

export default function SocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, room, gameId } = useStore();

  const socketMessage = (msg: string) => {
    console.log("Received socket message:", msg);
    toast(msg);
  };
  const socketError = (err: string) => {
    console.error("Received socket error:", err);
    toast.error("An Error Occurred");
  };

  useEffect(() => {
    socket.auth = { userId: user?.id, roomCode: room?.code, gameId };
    socket.connect();
    socket.on("message", socketMessage);
    socket.on("error", socketError);

    return () => {
      socket.off("message", socketMessage);
      socket.off("error", socketError);
      socket.disconnect();
    };
  }, [user?.id, room?.code, gameId]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
