"use client";

import { FormEvent, useState } from "react";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import { FaGoogle } from "react-icons/fa";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import Button, { LinkSecondaryButton } from "./button";
import { RoomInfo } from "@ai/app/server-actions";
import Input from "./input";
import Ellipsis from "./ellipsis";

interface FormElementsType extends HTMLFormControlsCollection {
  nickname: HTMLInputElement;
}

export interface NicknameFormType extends HTMLFormElement {
  readonly elements: FormElementsType;
}

type SignInFormProps =
  | {
      session: Session | null;
      room?: never;
      submitLabel: string;
      type: "HOME";
    }
  | {
      session: Session | null;
      room: RoomInfo;
      submitLabel: string;
      type: "INVITE";
    };

const SignInForm = ({ session, room, submitLabel, type }: SignInFormProps) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (e: FormEvent<NicknameFormType>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formNickname: string = e.currentTarget.elements.nickname.value;

      const callbackUrl =
        type === "HOME"
          ? `/api/host/?nickname=${formNickname.split(" ").join("+")}`
          : `/api/join/?nickname=${formNickname.split(" ").join("+")}&code=${
              room.code
            }`;

      if (session) {
        router.push(callbackUrl);
        return;
      }

      signIn("google", { callbackUrl });
    } catch (error) {
      setLoading(false);

      if (error instanceof Error) {
        console.error(error);

        if (error.message === "Room is full") {
          toast.error("Room is full! Unable to join.");
          return;
        }

        toast.error(
          `An Error Occurred ${
            type === "HOME"
              ? "Trying to Create a Room"
              : "Trying to Join the Room"
          }`,
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
        defaultValue={session?.user?.nickname ?? ""}
        maxLength={50}
        required
        label="Enter a cool nickname"
      />
      <div className="mt-8 flex flex-wrap gap-x-2 gap-y-4">
        <Button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2"
        >
          {!loading ? (
            <>
              {submitLabel} {!session && <FaGoogle />}
            </>
          ) : (
            <Ellipsis />
          )}
        </Button>
        <LinkSecondaryButton href="/how-to-play">
          How to Play
        </LinkSecondaryButton>
      </div>
    </form>
  );
};

export default SignInForm;
