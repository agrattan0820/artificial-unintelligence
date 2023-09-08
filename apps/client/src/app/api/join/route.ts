import { redirect } from "next/navigation";

import { joinRoom } from "@ai/app/server-actions";
import { authOptions } from "@ai/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions(req));

  if (!session) {
    redirect("/");
  }

  const searchParams = new URL(req.url).searchParams;

  const nickname = searchParams.get("nickname");
  const roomCode = searchParams.get("code");

  if (!roomCode || !nickname) {
    redirect("/");
  }

  await joinRoom({ userId: session.user.id, nickname, code: roomCode });

  redirect(`/room/${roomCode}`);
}
