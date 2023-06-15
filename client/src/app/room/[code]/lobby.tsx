"use client";

import RoomLink from "./room-link";
import UserCount from "@ai/components/user-count";
import ConnectionStatus from "@ai/components/connection-status";
import { useStore } from "@ai/utils/store";
import StoreInitializer from "@ai/utils/store-initializer";
import { RoomInfo, getRoomInfo } from "@ai/app/server-actions";
import PlayerPresence from "@ai/utils/player-presence";
import UserList from "./user-list";
import StartGame from "./start-game";
import { useEffect } from "react";
import { socket } from "@ai/utils/socket";
import toast from "react-hot-toast";

export default function Lobby({ roomInfo }: { roomInfo: RoomInfo }) {
  const helloMessages = (msg: string) => {
    console.log("received messages!");
    toast(msg);
  };
  const message = (msg: string) => {
    console.log("Received messages:", msg);
    toast(msg);
  };

  useEffect(() => {
    socket.emit("connectToRoom", roomInfo.code);
    socket.on("hello", helloMessages);
    socket.on("message", message);

    return () => {
      socket.off("hello", helloMessages);
      socket.off("message", message);
    };
  }, [roomInfo.code]);

  return (
    <main className="flex min-h-screen flex-col justify-center">
      {/* <PlayerPresence code={room.code} /> */}
      <section className="container mx-auto px-4">
        <p className="mb-2 text-center text-xl">Your Room Link is</p>
        <RoomLink code={roomInfo.code} />
        <div className="absolute left-8 top-8">
          <UserCount
            code={roomInfo.code}
            initialCount={roomInfo.players.length}
          />
        </div>
        {/* <ConnectionStatus code={params.code} /> */}
        <UserList />
        <StartGame code={roomInfo.code} />
      </section>
    </main>
  );
}
