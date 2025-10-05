import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";

import { getGameInfo } from "@ai/utils/queries";
import Game from "./game";
import { authOptions } from "@ai/pages/api/auth/[...nextauth]";
import { isUserInGame } from "@ai/utils/server-actions";

export default async function GamePage({
  params,
}: PageProps<"/room/[code]/game/[gameId]">) {

  const session = await getServerSession(authOptions());

  const { gameId } = await params;

  const cookieStore = await cookies();


  const sessionToken =
    cookieStore.get("__Secure-next-auth.session-token") ??
    cookieStore.get("next-auth.session-token");

  if (!session || !sessionToken) {
    redirect("/");
  }

  const userInGame = await isUserInGame({ gameId: Number(gameId), session });

  if (!userInGame) {
    redirect("/");
  }

  const gameInfo = await getGameInfo(Number(gameId), sessionToken.value);

  return <Game gameInfo={gameInfo} session={session} />;
}
