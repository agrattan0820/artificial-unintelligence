import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";

import { joinRoom } from "@ai/app/server-actions";
import { authOptions } from "@ai/pages/api/auth/[...nextauth]";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions(req));

  const sessionToken = cookies().get("next-auth.session-token");

  if (!session || !sessionToken) {
    redirect("/");
  }

  const searchParams = new URL(req.url).searchParams;

  const nickname = searchParams.get("nickname");
  const roomCode = searchParams.get("code");

  if (!roomCode || !nickname) {
    redirect("/");
  }

  await joinRoom({
    userId: session.user.id,
    nickname,
    code: roomCode,
    sessionToken: sessionToken.value,
  });

  redirect(`/room/${roomCode}`);
}
