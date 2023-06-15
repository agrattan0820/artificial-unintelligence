"use client";

import RoomLink from "./room-link";
import UserCount from "@ai/components/user-count";
import { RoomInfo, User, getRoomInfo } from "@ai/app/server-actions";
import UserList from "./user-list";
import StartGame from "./start-game";
import { useEffect, useState } from "react";
import { socket } from "@ai/utils/socket";
import toast from "react-hot-toast";
import { useStore } from "@ai/utils/store";

export default function Lobby({ roomInfo }: { roomInfo: RoomInfo }) {
  const { user } = useStore();
  const [players, setPlayers] = useState<User[]>(roomInfo.players);

  const message = (msg: string) => {
    console.log("Received messages:", msg);
    toast(msg);
  };

  const handleRoomState = (roomInfo: RoomInfo) => {
    console.log("[ROOM INFO]", roomInfo);
    setPlayers(roomInfo.players);
  };

  useEffect(() => {
    socket.auth = { userId: user?.id };
    socket.connect();
    socket.emit("connectToRoom", roomInfo.code);
    socket.on("message", message);
    socket.on("roomState", handleRoomState);

    return () => {
      socket.off("message", message);
      socket.off("roomState", handleRoomState);
      socket.disconnect();
    };
  }, [roomInfo.code, user?.id]);

  return (
    <main className="flex min-h-screen flex-col justify-center">
      {/* <PlayerPresence code={room.code} /> */}
      <section className="container mx-auto px-4">
        <p className="mb-2 text-center text-xl">Your Room Link is</p>
        <RoomLink code={roomInfo.code} />
        <div className="absolute left-8 top-8">
          <UserCount count={players.length} />
        </div>
        {/* <ConnectionStatus code={params.code} /> */}
        <UserList players={players} />
        <StartGame code={roomInfo.code} />
      </section>
    </main>
  );
}
