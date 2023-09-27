"use client";

import { createContext, useEffect } from "react";
import toast from "react-hot-toast";

import { socket } from "./socket";
import { useParams } from "next/navigation";
import type { Session } from "next-auth";

export const SocketContext = createContext(socket);

export default function SocketProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session;
}) {
  const params = useParams();

  const socketMessage = (msg: string) => {
    console.log("Received socket message:", msg);
    toast(msg);
  };
  const socketError = (error: string) => {
    console.error("Received socket error:", error);
    toast.error("An Error Occurred");
  };

  const socketConnectError = (error: Error) => {
    console.error(error.message);
    toast.error("Failed to connect to server, please try again later");
  };

  useEffect(() => {
    socket.auth = {
      userId: session.user.id,
      roomCode: params?.code ?? "",
      gameId: params?.gameId ?? "",
    };
    if (session?.user?.id) {
      socket.connect();
    }
    socket.on("connect_error", socketConnectError);
    socket.on("message", socketMessage);
    socket.on("error", socketError);

    return () => {
      socket.off("connect_error", socketConnectError);
      socket.off("message", socketMessage);
      socket.off("error", socketError);
      socket.disconnect();
    };
  }, [params?.code, params?.gameId, session?.user?.id]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
