"use client";

import { io } from "socket.io-client";

const socket = io("http://localhost:8080");

export default function Home() {
  const emitCustomEvent = () => {
    socket.emit("customEvent", { hello: "world" });
  };

  return (
    <main className="flex min-h-screen flex-col justify-center">
      <section className="container mx-auto px-4">
        <h1 className="mb-8 text-6xl">beeeeeeeep</h1>
        <div className="relative mb-8">
          <input
            id="nickname"
            className="peer h-10 border-b-2 border-l-2 border-gray-400 bg-transparent px-2 placeholder-transparent focus:border-indigo-600 focus:outline-none"
            type="text"
            placeholder="enter a nickname"
          />
          <label
            htmlFor="nickname"
            className="absolute -top-3.5 left-2 text-sm text-gray-600 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600"
          >
            Enter a cool nickname
          </label>
        </div>
        <div className="space-x-2">
          <button
            onClick={emitCustomEvent}
            className="bg-indigo-600 px-4 text-white transition hover:bg-indigo-500 focus:bg-indigo-700"
          >
            Start Game
          </button>
          <button className="bg-gray-300 px-4 transition hover:bg-gray-200 focus:bg-gray-400">
            How to Play
          </button>
        </div>
      </section>
    </main>
  );
}
