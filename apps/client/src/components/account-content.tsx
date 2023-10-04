"use client";

import Image from "next/image";
import Button from "./button";
// import { useRef } from "react";
// import { FiX } from "react-icons/fi";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import * as Sentry from "@sentry/nextjs";

export default function AccountContent({ session }: { session: Session }) {
  // const dialogRef = useRef<HTMLDialogElement>(null);

  const handleSignOut = () => {
    Sentry.setUser(null);
    signOut();
  };

  // const handleDeleteAccount = () => {
  //   Sentry.setUser(null);
  //   signOut();
  // };

  return (
    <>
      <section className="container mx-auto flex flex-col items-center justify-center gap-4 px-4">
        <h1 className="mb-8 text-2xl">Your Account</h1>
        {session.user.image && (
          <Image
            src={session.user.image}
            alt={`${session.user.name}'s Google profile image`}
            width={64}
            height={64}
            className="h-16 w-16 rounded-full shadow"
          />
        )}
        <div>
          <p>Name: {session.user.name}</p>
          <p>Email: {session.user.email}</p>
        </div>
        <Button onClick={handleSignOut}>Sign Out</Button>
        {/* TODO: finish ability to delete account */}
        {/* <SecondaryButton onClick={() => dialogRef.current?.showModal()}>
          Delete Account
        </SecondaryButton> */}
      </section>
      {/* TODO: finish ability to delete account */}
      {/* <dialog
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
      </dialog> */}
    </>
  );
}
