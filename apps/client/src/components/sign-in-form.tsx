"use client";

import { signIn, useSession } from "next-auth/react";
import { FaGoogle } from "react-icons/fa";
import Button, { LinkSecondaryButton } from "./button";

const SignInForm = () => {
  const { data: session } = useSession();

  console.log("CLIENT SESSION", session);

  return (
    <div className="mt-8 flex flex-wrap gap-x-2 gap-y-4">
      <Button
        onClick={() =>
          signIn("google", { callbackUrl: "/auth?nickname=Big+Al" })
        }
        className="flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-1"
      >
        Sign-in with Google <FaGoogle />
      </Button>
      <LinkSecondaryButton href="/how-to-play">How to Play</LinkSecondaryButton>
    </div>
  );
};

export default SignInForm;
