"use client";

import { createContext, useEffect } from "react";
import toast from "react-hot-toast";

import { socket } from "./socket";
import { useStore } from "./store";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";

export const SocketContext = createContext(socket);

export default function SocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { room, gameId } = useStore();
  const { data: session } = useSession();
  const params = useParams();

  const socketMessage = (msg: string) => {
    console.log("Received socket message:", msg);
    toast(msg);
  };
  const socketError = (err: string) => {
    console.error("Received socket error:", err);
    toast.error("An Error Occurred");
  };

  useEffect(() => {
    socket.auth = {
      userId: session?.user?.id ?? "",
      roomCode: room?.code ?? params?.code ?? "",
      gameId,
    };
    socket.connect();
    socket.on("message", socketMessage);
    socket.on("error", socketError);

    return () => {
      socket.off("message", socketMessage);
      socket.off("error", socketError);
      socket.disconnect();
    };
  }, [room?.code, gameId, session?.user?.id, params?.code]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
