import { existingHost } from "@ai/app/server-actions";
import { authOptions } from "@ai/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions(req));

  if (!session) {
    redirect("/");
  }

  const searchParams = new URL(req.url).searchParams;

  const nickname = searchParams.get("nickname");

  if (!nickname) {
    redirect("/");
  }

  const roomForExistingUser = await existingHost({
    userId: session.user.id,
    nickname,
  });

  redirect(`/room/${roomForExistingUser.room.code}`);
}
