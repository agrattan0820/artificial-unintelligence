"use client";

import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import { socket } from "@ai/utils/socket";
import NicknameForm, { NicknameFormType } from "@ai/components/nickname-form";
import { useStore } from "@ai/utils/store";
import { useRouter } from "next/navigation";
import { CreateUserResponse } from "@ai/types/api.type";

export default function Invite({ params }: { params: { code: string } }) {
  const [loading, setLoading] = useState(false);
  const { user, setUser } = useStore();
  const router = useRouter();

  const message = (msg: string) => {
    console.log("Received message", msg);
    toast(msg);
  };

  const onSubmit = async (e: FormEvent<NicknameFormType>) => {
    e.preventDefault();
    setLoading(true);
    const formNickname = e.currentTarget.elements.nickname.value;

    // REST POST
    const response = await fetch("http://localhost:8080/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nickname: formNickname }),
    });

    const data: CreateUserResponse = await response.json();
    socket.emit("joinRoom", {});

    console.log("RESPONSE", data);

    setUser(data.user);

    // await new Promise((resolve) => setTimeout(resolve, 1000));
    // router.push(`/room/${data.room.code}`);
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
