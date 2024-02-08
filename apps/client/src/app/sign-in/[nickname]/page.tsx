import Link from "next/link";
import { getServerSession } from "next-auth/next";

import Footer from "@ai/components/footer";
import Friend from "@ai/components/game/friend";
import Header from "@ai/components/header";
import { authOptions } from "@ai/pages/api/auth/[...nextauth]";
import { redirect } from "next/navigation";
import { ContinueWithGoogleButton } from "@ai/components/sign-in-form";

export default async function SignInPage({
  params,
  searchParams,
}: {
  params: { nickname: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getServerSession(authOptions());

  if (session) {
    redirect("/");
  }

  const nickname = decodeURI(params.nickname);

  const roomCode = Array.isArray(searchParams?.code)
    ? searchParams?.code[0]
    : typeof searchParams?.code === "string"
      ? decodeURI(searchParams?.code)
      : undefined;

  return (
    <>
      <Header session={session} />
      <main className="container mx-auto flex min-h-screen items-center justify-center px-4 py-16 md:py-32">
        <section>
          <div className="mx-auto grid w-full max-w-xl grid-cols-1 gap-x-8 gap-y-4 rounded-2xl p-8 ring ring-slate-600 md:grid-cols-[8rem_1fr]">
            <Friend className="w-32" type="KAWAII" />
            <h1 className="self-center text-2xl md:text-3xl">
              Welcome back! <br />
              Sign in to play
            </h1>
            <div className="md:col-start-2">
              <ContinueWithGoogleButton
                nickname={nickname}
                roomCode={roomCode}
              />
              <p className="mt-4 text-xs">
                Haven&apos;t played before?{" "}
                <Link
                  href={`/create-account/${encodeURI(nickname)}${roomCode ? `?code=${encodeURI(roomCode)}` : ""}`}
                  className="underline underline-offset-2"
                >
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
