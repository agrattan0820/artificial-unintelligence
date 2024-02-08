"use client";

import { FormEvent, useState } from "react";
import type { Session } from "next-auth";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { FiPlay } from "react-icons/fi";

import Button, { LinkSecondaryButton, SecondaryButton } from "./button";
import { RoomInfo } from "@ai/utils/queries";
import Input from "./input";
import Ellipsis from "./ellipsis";
import useIsMounted from "@ai/utils/hooks/use-is-mounted";
import { FaGoogle } from "react-icons/fa";

interface FormElementsType extends HTMLFormControlsCollection {
  nickname: HTMLInputElement;
}

export interface NicknameFormType extends HTMLFormElement {
  readonly elements: FormElementsType;
}

type SignInFormProps = {
  session: Session | null;
  room: RoomInfo | undefined;
  submitLabel: string;
  type: "HOME" | "INVITE";
};

const SignInForm = ({ session, room, submitLabel, type }: SignInFormProps) => {
  const router = useRouter();
  const isMounted = useIsMounted();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent<NicknameFormType>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formNickname: string = e.currentTarget.elements.nickname.value;

      if (session) {
        const origin = isMounted
          ? window.location.origin
          : "https://www.artificialunintelligence.gg";

        const callbackUrl = new URL(
          type === "INVITE" && room
            ? `/api/join/?nickname=${formNickname}&code=${room.code}`
            : `/api/host/?nickname=${formNickname}`,
          origin,
        );

        router.push(callbackUrl.toString());
        return;
      }

      const isNewUser = !isMounted
        ? true
        : !window.localStorage.getItem("existing-user");

      const url = `/${isNewUser ? "create-account" : "sign-in"}/${formNickname}${type === "INVITE" && room ? `?code=${room.code}` : ""}`;

      if (isMounted) {
        window.localStorage.setItem("existing-user", "true");
      }

      router.push(url);
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
        maxLength={15}
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
              {submitLabel} <FiPlay />
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

export const ContinueWithGoogleButton = ({
  nickname,
  roomCode,
}: {
  nickname: string;
  roomCode: string | undefined;
}) => {
  const isMounted = useIsMounted();
  const [loading, setLoading] = useState(false);

  const onSubmit = () => {
    setLoading(true);
    try {
      const origin = isMounted
        ? window.location.origin
        : "https://www.artificialunintelligence.gg";

      const callbackUrl = new URL(
        roomCode
          ? `/api/join/?nickname=${nickname}&code=${roomCode}`
          : `/api/host/?nickname=${nickname}`,
        origin,
      );

      signIn("google", { callbackUrl: callbackUrl.toString() });
    } catch (error) {
      setLoading(false);

      if (error instanceof Error) {
        console.error(error);

        if (error.message === "Room is full") {
          toast.error("Room is full! Unable to join.");
          return;
        }

        toast.error(`An Error Occurred`);
      }
    }
  };

  return (
    <SecondaryButton
      className="flex items-center justify-center gap-2"
      onClick={onSubmit}
    >
      {!loading ? (
        <>
          <FaGoogle /> Continue with Google
        </>
      ) : (
        <Ellipsis />
      )}
    </SecondaryButton>
  );
};
