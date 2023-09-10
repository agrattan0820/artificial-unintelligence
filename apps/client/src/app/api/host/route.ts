import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { existingHost } from "@ai/app/server-actions";
import { authOptions } from "@ai/pages/api/auth/[...nextauth]";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions(req));

  const sessionToken = cookies().get("next-auth.session-token");

  if (!session || !sessionToken) {
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
    sessionToken: sessionToken.value,
  });

  redirect(`/room/${roomForExistingUser.room.code}`);
}
