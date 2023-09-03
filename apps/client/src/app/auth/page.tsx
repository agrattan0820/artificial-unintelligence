"use client";

import Footer from "@ai/components/footer";
import Friend from "@ai/components/game/friend";
import { FaGoogle } from "react-icons/fa";
import { signIn } from "next-auth/react";

export default function AuthPage() {
  return (
    <main className="relative flex min-h-[100dvh] flex-col justify-center">
      <section className="container mx-auto flex flex-col-reverse items-start justify-center gap-8 px-4 lg:flex-row lg:gap-24">
        <div>
          <h1 className="mb-8 text-4xl md:text-6xl">Auth Page</h1>
          <button
            onClick={() => signIn("google")}
            className="flex items-center justify-center gap-2 rounded-md bg-slate-700 px-4 py-1"
          >
            Sign-in with Google <FaGoogle />
          </button>
        </div>
        <Friend className="w-32 lg:w-1/4" />
      </section>
      <Footer />
    </main>
  );
}
