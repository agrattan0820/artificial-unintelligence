"use client";

import { useEffect, useState } from "react";
import { socket } from "@ai/utils/socket";
import { toast } from "react-hot-toast";

export default function Room({ params }: { params: { code: string } }) {
  const [players, setPlayers] = useState();

  const message = (msg: string) => {
    console.log("Received message", msg);
    toast(msg);
  };

  useEffect(() => {
    socket.on("message", message);

    return () => {
      socket.on("message", message);
    };
  }, []);

  return (
    <main className="flex min-h-screen flex-col justify-center">
      <section className="container mx-auto px-4">
        <h1 className="text-6xl">Welcome to Room {params.code} 🎉</h1>
        <div className="rounded-full p-5 ring ring-indigo-700"></div>
      </section>
    </main>
  );
}
