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
  const { user } = useStore();

  const message = (msg: string) => {
    console.log("Received messages:", msg);
    toast(msg);
  };

  useEffect(() => {
    socket.auth = { userId: user?.id };
    socket.connect();
    socket.on("message", message);
    console.log("PROVIDER SOCKET", socket.id);

    return () => {
      socket.off("message", message);
      socket.disconnect();
    };
  }, [user?.id]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
