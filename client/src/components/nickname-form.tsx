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
import Input from "./input";

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
      <Input
        id="nickname"
        type="text"
        placeholder="enter a nickname"
        defaultValue={user?.nickname ?? ""}
        maxLength={50}
        required
        label="Enter a cool nickname"
      />
      <div className="mt-8 space-x-2">
        <Button type="submit" disabled={loading}>
          {!loading ? <>{submitLabel}</> : <Ellipsis />}
        </Button>
        <SecondaryButton disabled={loading}>How to Play</SecondaryButton>
      </div>
    </form>
  );
};

export default NicknameForm;
