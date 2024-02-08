/* eslint-disable @next/next/no-img-element */
"use client";

import Button, { SecondaryButton } from "./button";
import { useRef } from "react";
import { FiX } from "react-icons/fi";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import * as Sentry from "@sentry/nextjs";
import { deleteUser } from "@ai/utils/queries";
import toast from "react-hot-toast";
import useIsMounted from "@ai/utils/hooks/use-is-mounted";

export default function AccountContent({ session }: { session: Session }) {
  const isMounted = useIsMounted();
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleSignOut = () => {
    if (isMounted) {
      window.localStorage.removeItem("existing-user");
    }
    Sentry.setUser(null);
    signOut();
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteUser(session.user.id);
      Sentry.setUser(null);
      signOut();
    } catch (error) {
      toast.error("Unable to delete your account");
      Sentry.captureException(error);
    }
  };

  return (
    <>
      <section className="container mx-auto flex flex-col items-center justify-center gap-4 px-4">
        <h1 className="mb-8 text-2xl">Your Account</h1>
        {session.user.image && (
          <img
            src={session.user.image}
            alt={`${session.user.name}'s Google profile image`}
            width={96}
            height={96}
            className="relative z-10 h-24 w-24 rounded-full shadow"
          />
        )}
        <div className=" -mt-8 rounded-2xl bg-slate-800 p-8 text-sm md:text-base">
          <p>Name: {session.user.name}</p>
          <p>Email: {session.user.email}</p>
        </div>
        <Button className="mt-8" onClick={handleSignOut}>
          Sign Out
        </Button>
        <SecondaryButton onClick={() => dialogRef.current?.showModal()}>
          Delete Account
        </SecondaryButton>
      </section>
      <dialog
        ref={dialogRef}
        className="relative mx-auto w-full max-w-2xl rounded-xl p-8 transition backdrop:bg-slate-900/50 open:animate-modal open:backdrop:animate-modal"
      >
        <form method="dialog">
          <button className="absolute right-4 top-4 text-xl md:text-2xl">
            <FiX />
          </button>
          <p className="text-2xl">
            Are you sure you would like to delete your account?
          </p>
          <div className="mt-8 flex gap-2">
            <Button>No, nevermind</Button>
            <SecondaryButton onClick={handleDeleteAccount}>
              Yes, delete my account
            </SecondaryButton>
          </div>
        </form>
      </dialog>
    </>
  );
}
