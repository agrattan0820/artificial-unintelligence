"use client";

import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import { socket } from "@ai/utils/socket";
import NicknameForm, { NicknameFormType } from "@ai/components/nickname-form";
import { useStore } from "@ai/utils/store";
import { useRouter } from "next/navigation";
import { CreateUserResponse, GetRoomResponse } from "@ai/types/api.type";

export default async function Invite({ params }: { params: { code: string } }) {
  const roomResponse = await fetch(`http://localhost:8080/room/${params.code}`);

  const roomData: GetRoomResponse = await roomResponse.json();

  console.log(roomData);

  return (
    <main className="flex min-h-screen flex-col justify-center">
      <section className="container mx-auto px-4">
        <h1 className="mb-8 text-6xl">beeeeeeeep</h1>
        <NicknameForm
          room={roomData.room}
          type="INVITE"
          submitLabel="Start Game"
        />
      </section>
    </main>
  );
}
