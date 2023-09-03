"use client";

import { motion } from "framer-motion";
import { useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import InviteLink from "./invite-link";
import UserCount from "@ai/components/user-count";
import { RoomInfo, User } from "@ai/app/server-actions";
import UserList from "./user-list";
import StartGame from "./start-game";
import { useStore } from "@ai/utils/store";
import { SocketContext } from "@ai/utils/socket-provider";

export default function Lobby({ roomInfo }: { roomInfo: RoomInfo }) {
  const router = useRouter();
  const { user } = useStore();
  const [hostId, setHostId] = useState<number | null>(roomInfo.hostId);
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
    socket.emit("connectToRoom", roomInfo.code);
    socket.on("roomState", handleRoomState);
    socket.on("startGame", handleStartGame);
    socket.on("error", handleError);

    return () => {
      socket.off("roomState", handleRoomState);
      socket.off("startGame", handleStartGame);
      socket.off("error", handleError);
    };
  }, [handleStartGame, roomInfo.code, socket, user?.id]);

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
        <UserList hostId={hostId} players={players} />
        <StartGame
          players={players}
          code={roomInfo.code}
          hostId={hostId}
          onStartGame={initiateStartGame}
          loading={startGameLoading}
          roomIsFull={roomIsFull}
        />
      </motion.section>
    </main>
  );
}