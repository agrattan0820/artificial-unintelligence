"use client";

import { FormEvent } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:8080");

interface FormElementsType extends HTMLFormControlsCollection {
  nickname: HTMLInputElement;
}
interface FormType extends HTMLFormElement {
  readonly elements: FormElementsType;
}

export default function Home() {
  socket.on("hello", (msg) => {
    console.log("received messages!");
    console.log(msg);
  });

  const onSubmit = (e: FormEvent<FormType>) => {
    e.preventDefault();
    const formNickname = e.currentTarget.elements.nickname.value;
    console.log(formNickname);
    socket.emit("createUser", { nickname: formNickname });
  };

  return (
    <main className="flex min-h-screen flex-col justify-center">
      <section className="container mx-auto px-4">
        <h1 className="mb-8 text-6xl">beeeeeeeep</h1>
        <form onSubmit={onSubmit}>
          <div className="relative mb-8">
            <input
              id="nickname"
              className="peer h-10 border-b-2 border-l-2 border-gray-400 bg-transparent px-2 placeholder-transparent focus:border-indigo-600 focus:outline-none"
              type="text"
              placeholder="enter a nickname"
              required
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
              type="submit"
              className="bg-indigo-600 px-4 text-white transition hover:bg-indigo-500 focus:bg-indigo-700"
            >
              Start Game
            </button>
            <button className="bg-gray-300 px-4 transition hover:bg-gray-200 focus:bg-gray-400">
              How to Play
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
