import { joinRoom } from "@ai/app/server-actions";
import { authOptions } from "@ai/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions(req));

  if (!session) {
    redirect("/");
  }

  const roomCode = new URL(req.url).searchParams.get("code");

  if (!roomCode) {
    redirect("/");
  }

  await joinRoom(session.user.id, roomCode);

  redirect(`/room/${roomCode}`);
}
