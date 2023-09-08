"use client";

import { motion } from "framer-motion";
import { useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";

import InviteLink from "./invite-link";
import UserCount from "@ai/components/user-count";
import { RoomInfo, User } from "@ai/app/server-actions";
import UserList from "./user-list";
import StartGame from "./start-game";
import { SocketContext } from "@ai/utils/socket-provider";
import UserMenu from "@ai/components/user-menu";

export default function Lobby({
  roomInfo,
  session,
}: {
  roomInfo: RoomInfo;
  session: Session;
}) {
  const router = useRouter();
  const [hostId, setHostId] = useState<string | null>(roomInfo.hostId);
  const [players, setPlayers] = useState<User[]>(roomInfo.players);
  const [startGameLoading, setStartGameLoading] = useState(false);

  const socket = useContext(SocketContext);

  const roomIsFull = players.length >= 8;

  const handleRoomState = (roomInfo: RoomInfo) => {
    console.log("[ROOM INFO]", roomInfo);
    setHostId(roomInfo.hostId);
    setPlayers(roomInfo.players);
  };

  const handleStartGame = useCallback(() => {
    console.log("[RECEIVED START GAME]");
    router.push(`/room/${roomInfo.code}/game`);
  }, [roomInfo.code, router]);

  const initiateStartGame = () => {
    setStartGameLoading(true);
    socket.emit("initiateGame", roomInfo.code);
  };

  const handleError = () => {
    setStartGameLoading(false);
  };

  useEffect(() => {
    socket.emit("connectToRoom", {
      userId: session.user.id,
      code: roomInfo.code,
    });
    socket.on("roomState", handleRoomState);
    socket.on("startGame", handleStartGame);
    socket.on("error", handleError);

    return () => {
      socket.off("roomState", handleRoomState);
      socket.off("startGame", handleStartGame);
      socket.off("error", handleError);
    };
  }, [handleStartGame, roomInfo.code, socket, session]);

  return (
    <main className="flex min-h-[100dvh] flex-col justify-center">
      <motion.section layout="position" className="container mx-auto px-4">
        {!roomIsFull && (
          <p className="mb-2 hidden text-center text-xl sm:block">
            Your Invite Link is
          </p>
        )}
        <InviteLink code={roomInfo.code} roomIsFull={roomIsFull} />
        <div className="mx-auto mt-4 flex items-center justify-center md:absolute md:left-8 md:top-8">
          <UserCount count={players.length} />
        </div>
        <div className="absolute right-8 top-8 mt-4">
          <UserMenu />
        </div>
        <UserList session={session} hostId={hostId} players={players} />
        <StartGame
          players={players}
          code={roomInfo.code}
          hostId={hostId}
          onStartGame={initiateStartGame}
          loading={startGameLoading}
          roomIsFull={roomIsFull}
          session={session}
        />
      </motion.section>
    </main>
  );
}
