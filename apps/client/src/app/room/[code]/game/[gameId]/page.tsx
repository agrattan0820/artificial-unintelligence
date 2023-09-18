import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";

import { getGameInfo } from "@ai/utils/queries";
import Game from "./game";
import { authOptions } from "@ai/pages/api/auth/[...nextauth]";
import { isUserInGame } from "@ai/utils/server-actions";

export default async function GamePage({
  params,
}: {
  params: { code: string; gameId: number };
}) {
  const session = await getServerSession(authOptions());

  const sessionToken =
    cookies().get("__Secure-next-auth.session-token") ??
    cookies().get("next-auth.session-token");

  if (!session || !sessionToken) {
    redirect("/");
  }

  const userInGame = await isUserInGame({ gameId: params.gameId, session });

  if (!userInGame) {
    redirect("/");
  }

  const gameInfo = await getGameInfo(params.gameId, sessionToken.value);

  console.log("[GAME INFO]", gameInfo);

  return <Game gameInfo={gameInfo} session={session} />;
}
