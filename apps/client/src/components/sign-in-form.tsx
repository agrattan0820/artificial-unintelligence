"use client";

import { signIn } from "next-auth/react";
import { FaGoogle } from "react-icons/fa";
import { LinkSecondaryButton } from "./button";

const SignInForm = () => {
  return (
    <div className="mt-8 flex flex-wrap gap-x-2 gap-y-4">
      <button
        onClick={() => signIn("google")}
        className="flex items-center justify-center gap-2 rounded-md bg-slate-700 px-4 py-1"
      >
        Sign-in with Google <FaGoogle />
      </button>
      <LinkSecondaryButton href="/how-to-play">How to Play</LinkSecondaryButton>
    </div>
  );
};

export default SignInForm;
