import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { getRoomInfo } from "@ai/app/server-actions";
import Lobby from "./lobby";
import Footer from "@ai/components/footer";
import { authOptions } from "@ai/pages/api/auth/[...nextauth]";
import { isUserInRoom } from "@ai/utils/query";

export default async function Room({ params }: { params: { code: string } }) {
  const session = await getServerSession(authOptions());

  if (!session) {
    redirect("/");
  }

  const userInRoom = await isUserInRoom({ roomCode: params.code, session });

  if (!userInRoom) {
    redirect("/");
  }

  const roomInfo = await getRoomInfo(params.code);

  return (
    <div>
      <Lobby roomInfo={roomInfo} session={session} />
      <Footer />
    </div>
  );
}
