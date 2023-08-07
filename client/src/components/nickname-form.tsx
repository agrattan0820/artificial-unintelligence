"use client";

import { FormEvent, useState } from "react";
import Ellipsis from "./ellipsis";
import { useStore } from "@ai/utils/store";
import { useRouter } from "next/navigation";

import {
  RoomInfo,
  createHost,
  existingHost,
  joinRoom,
} from "@ai/app/server-actions";
import Button, { LinkSecondaryButton, SecondaryButton } from "./button";
import Input from "./input";
import { toast } from "react-hot-toast";

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

    try {
      if (type === "HOME") {
        if (user && user.nickname === formNickname) {
          const roomForExistingUser = await existingHost(user.id);
          setRoom(roomForExistingUser.room);
          router.push(`/room/${roomForExistingUser.room.code}`);
          return;
        }

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
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        toast.error(
          `An Error Occurred ${
            type === "HOME"
              ? "Trying to Create a Game"
              : "Trying to Join the Game"
          }`
        );
      }
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <Input
        id="nickname"
        type="text"
        placeholder="Enter a cool nickname"
        defaultValue={user?.nickname ?? ""}
        maxLength={50}
        required
        label="Enter a cool nickname"
      />
      <div className="mt-8 gap-x-2 gap-y-4 flex flex-wrap">
        <Button type="submit" disabled={loading}>
          {!loading ? <>{submitLabel}</> : <Ellipsis />}
        </Button>
        <LinkSecondaryButton href="/how-to-play">
          How to Play
        </LinkSecondaryButton>
      </div>
    </form>
  );
};

export default NicknameForm;
