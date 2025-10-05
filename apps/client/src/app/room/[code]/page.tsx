import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { getRoomInfo } from "@ai/utils/queries";
import Lobby from "./lobby";
import { authOptions } from "@ai/pages/api/auth/[...nextauth]";
import { isUserInRoom } from "@ai/utils/server-actions";

export default async function Room({ params }: PageProps<"/room/[code]">) {
  const session = await getServerSession(authOptions());

  const { code } = await params;

  if (!session) {
    redirect("/");
  }

  const userInRoom = await isUserInRoom({ roomCode: code, session });

  if (!userInRoom) {
    redirect("/");
  }

  const roomInfo = await getRoomInfo(code);

  return <Lobby roomInfo={roomInfo} session={session} />;
}
