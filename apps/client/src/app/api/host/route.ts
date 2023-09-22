import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import * as Sentry from "@sentry/nextjs";

import { existingHost } from "@ai/utils/queries";
import { authOptions } from "@ai/pages/api/auth/[...nextauth]";

export async function GET(req: Request): Promise<never> {
  const session = await getServerSession(authOptions(req));

  const sessionToken =
    cookies().get("__Secure-next-auth.session-token") ??
    cookies().get("next-auth.session-token");

  if (!session || !sessionToken) {
    redirect("/");
  }

  Sentry.setUser({
    id: session.user.id,
    email: session.user.email ?? "",
    username: session.user.nickname,
  });

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
