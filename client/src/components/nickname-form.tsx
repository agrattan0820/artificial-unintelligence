"use client";

import { FormEvent, useState } from "react";
import Ellipsis from "./ellipsis";
import { useStore } from "@ai/utils/store";
import { useRouter } from "next/navigation";
import {
  CreateHostResponse,
  CreateUserResponse,
  Room,
  RoomInfo,
} from "@ai/types/api.type";
import { createHost, joinRoom } from "@ai/app/actions";
import Button, { SecondaryButton } from "./button";

interface FormElementsType extends HTMLFormControlsCollection {
  nickname: HTMLInputElement;
}

export interface NicknameFormType extends HTMLFormElement {
  readonly elements: FormElementsType;
}

type NicknameFormProps =
  | {
      room?: never;
      submitLabel: string;
      type: "HOME";
    }
  | {
      room: RoomInfo;
      submitLabel: string;
      type: "INVITE";
    };

// const createHost = async (nickname: string) => {
//   const response = await fetch("http://localhost:8080/user/createHost", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ nickname }),
//   });

//   const data: CreateHostResponse = await response.json();

//   console.log("RESPONSE", data);
//   return data;
// };

// const createUser = async (nickname: string) => {
//   const response = await fetch("http://localhost:8080/user", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ nickname }),
//   });

//   const data: CreateUserResponse = await response.json();

//   console.log("RESPONSE", data);
//   return data;
// };

const NicknameForm = ({ room, submitLabel, type }: NicknameFormProps) => {
  const { user, setUser } = useStore();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (e: FormEvent<NicknameFormType>) => {
    e.preventDefault();
    setLoading(true);
    const formNickname = e.currentTarget.elements.nickname.value;

    // REST POST

    if (type === "HOME") {
      const hostData = await createHost(formNickname);
      setUser(hostData.host);
      router.push(`/room/${hostData.room.code}`);
    }

    if (type === "INVITE") {
      const joinData = await joinRoom(formNickname, room);
      setUser(joinData.user);
      if (room) router.push(`/room/${room.code}`);
    }
  };

  return (
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
        <Button type="submit" disabled={loading}>
          {!loading ? <>{submitLabel}</> : <Ellipsis />}
        </Button>
        <SecondaryButton disabled={loading}>How to Play</SecondaryButton>
      </div>
    </form>
  );
};

export default NicknameForm;
