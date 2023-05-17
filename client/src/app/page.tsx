"use client";

import Ellipsis from "@ai/components/ellipsis";
import NicknameForm, { NicknameFormType } from "@ai/components/nickname-form";
import { CreateHostResponse } from "@ai/types/api.type";
import { socket } from "@ai/utils/socket";
import { useStore } from "@ai/utils/store";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function Home() {
  const { user, setUser } = useStore();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const helloMessages = (msg: string) => {
    console.log("received messages!");
    toast(msg);
  };
  const message = (msg: string) => {
    console.log("Received messages:", msg);
    toast(msg);
  };

  const onSubmit = async (e: FormEvent<NicknameFormType>) => {
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
    socket.on("message", message);

    return () => {
      socket.off("hello", helloMessages);
      socket.on("message", message);
    };
  }, []);

  return (
    <main className="flex min-h-screen flex-col justify-center">
      <section className="container mx-auto px-4">
        <h1 className="mb-8 text-6xl">beeeeeeeep</h1>
        <NicknameForm
          onSubmit={onSubmit}
          user={user}
          loading={loading}
          submitBtnLabel="Start Game"
        />
      </section>
    </main>
  );
}
