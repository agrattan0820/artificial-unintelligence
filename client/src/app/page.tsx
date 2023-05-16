"use client";

import Ellipsis from "@ai/components/ellipsis";
import { CreateHostResponse } from "@ai/types/api.type";
import { socket } from "@ai/utils/socket";
import { useStore } from "@ai/utils/store";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

interface FormElementsType extends HTMLFormControlsCollection {
  nickname: HTMLInputElement;
}
interface FormType extends HTMLFormElement {
  readonly elements: FormElementsType;
}

export default function Home() {
  const { user, setUser } = useStore();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const helloMessages = (msg: string) => {
    console.log("received messages!");
    console.log(msg);
  };

  const onSubmit = async (e: FormEvent<FormType>) => {
    e.preventDefault();
    setLoading(true);
    const formNickname = e.currentTarget.elements.nickname.value;

    // SOCKET.IO POST
    // socket.emit(
    //   "createUser",
    //   { nickname: formNickname },
    //   (val: { id: number; nickname: string }) => {
    //     console.log("NEW USER", val);
    //   }
    // );
    // setNickname(formNickname);

    // REST POST
    const response = await fetch("http://localhost:8080/user/createHost", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nickname: formNickname }),
    });

    const data: CreateHostResponse = await response.json();

    console.log("RESPONSE", data);

    setUser(data.host);

    // await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push(`/room/${data.room.code}`);
  };

  console.log("user", user);

  useEffect(() => {
    socket.on("hello", helloMessages);

    return () => {
      socket.off("hello", helloMessages);
    };
  }, []);

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
              defaultValue={user?.nickname ?? ""}
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
              disabled={loading}
            >
              {!loading ? <>Start Game</> : <Ellipsis />}
            </button>
            <button
              className="bg-gray-300 px-4 transition hover:bg-gray-200 focus:bg-gray-400"
              disabled={loading}
            >
              How to Play
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
