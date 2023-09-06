import { existingHost } from "@ai/app/server-actions";
import { authOptions } from "@ai/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions(req));

  if (!session) {
    redirect("/");
  }

  const roomForExistingUser = await existingHost(session.user.id);

  redirect(`/room/${roomForExistingUser.room.code}`);
}
