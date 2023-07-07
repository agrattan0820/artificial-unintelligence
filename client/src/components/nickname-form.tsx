"use client";

import { FormEvent, useState } from "react";
import Ellipsis from "./ellipsis";
import { useStore } from "@ai/utils/store";
import { useRouter } from "next/navigation";
// import { createHost, joinRoom } from "@ai/app/supabase-actions";
import { RoomInfo, createHost, joinRoom } from "@ai/app/server-actions";
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

const NicknameForm = ({ room, submitLabel, type }: NicknameFormProps) => {
  const { user, setUser, setRoom } = useStore();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (e: FormEvent<NicknameFormType>) => {
    e.preventDefault();
    setLoading(true);
    const formNickname = e.currentTarget.elements.nickname.value;

    // alert(formNickname);

    if (type === "HOME") {
      const hostData = await createHost(formNickname);
      setUser(hostData.host);
      setRoom(hostData.room);
      router.push(`/room/${hostData.room.code}`);
    }

    if (type === "INVITE") {
      const joinData = await joinRoom(formNickname, room.code);
      setUser(joinData.user);
      setRoom(room);
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
