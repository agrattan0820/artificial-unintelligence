"use client";

import { useCallback, useEffect, useState } from "react";
import { useMachine } from "@xstate/react";
import { AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

import { gameMachine, getCurrentComponent } from "./game-machine";
import Button from "@ai/components/button";
import { socket } from "@ai/utils/socket";
import { RoomInfo, User } from "@ai/app/server-actions";
import { useStore } from "@ai/utils/store";
import type { EventFrom } from "xstate";

export default function Game({ params }: { params: { code: string } }) {
  const { user } = useStore();
  const [state, send] = useMachine(gameMachine);

  // const [players, setPlayers] = useState<User[]>(roomInfo.players);

  const message = (msg: string) => {
    console.log("Received messages:", msg);
    toast(msg);
  };

  const handleGameEvent = useCallback(
    (event: EventFrom<typeof gameMachine>) => {
      console.log("RECEIVED EVENT", event);
      send(event);
    },
    [send]
  );

  console.log("RENDER");

  // const handleRoomState = (roomInfo: RoomInfo) => {
  //   console.log("[ROOM INFO]", roomInfo);
  //   setPlayers(roomInfo.players);
  // };

  useEffect(() => {
    socket.auth = { userId: user?.id };
    socket.connect();
    // socket.emit("startGame", params.code);
    socket.on("message", message);

    console.log("HELLOOOOO");
    // socket.on("gameEvent", handleGameEvent);
    // socket.emit("connectToRoom", params.code);
    // socket.on("roomState", handleRoomState);

    return () => {
      socket.off("message", message);
      // socket.off("gameEvent", handleGameEvent);
      // socket.off("roomState", handleRoomState);
      socket.disconnect();
    };
  }, [params.code, user?.id]);

  return (
    <main className="flex min-h-screen flex-col justify-center">
      <section className="container mx-auto px-4">
        <AnimatePresence mode="wait">
          {getCurrentComponent(state)}
        </AnimatePresence>
      </section>
      <div className="fixed bottom-8 right-8 flex gap-2">
        <Button onClick={() => send("NEXT")}>Next</Button>
        <Button onClick={() => send("SUBMIT")}>Submit</Button>
        <Button onClick={() => send("MORE")}>More</Button>
      </div>
    </main>
  );
}
