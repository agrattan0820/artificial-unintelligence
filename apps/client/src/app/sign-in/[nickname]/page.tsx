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
}: PageProps<"/sign-in/[nickname]">) {
  const session = await getServerSession(authOptions());

  const { nickname } = await params;
  const { code } = await searchParams;

  if (session) {
    redirect("/");
  }

  const decodedNickname = decodeURI(nickname);

  const roomCode = Array.isArray(code)
    ? code[0]
    : typeof code === "string"
      ? decodeURI(code)
      : undefined;

  return (
    <>
      <Header session={session} />
      <main className="page-height-lg container mx-auto flex items-center justify-center px-4 pb-16 pt-48 lg:pb-0 lg:pt-0">
        <section>
          <div className="mx-auto grid w-full max-w-xl grid-cols-1 gap-x-8 gap-y-4 rounded-2xl p-8 ring ring-slate-600 md:grid-cols-[8rem_1fr]">
            <Friend className="w-32" type="KAWAII" />
            <h1 className="self-center text-2xl md:text-3xl">
              Welcome back! <br />
              Sign in to play
            </h1>
            <div className="md:col-start-2">
              <ContinueWithGoogleButton
                nickname={decodedNickname}
                roomCode={roomCode}
              />
              <p className="mt-4 text-xs">
                Haven&apos;t played before?{" "}
                <Link
                  href={`/create-account/${encodeURI(decodedNickname)}${roomCode ? `?code=${encodeURI(roomCode)}` : ""}`}
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
