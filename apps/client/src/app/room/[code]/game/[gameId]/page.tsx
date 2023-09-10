import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";

import { getGameInfo } from "@ai/app/server-actions";
import Game from "./game";
import ErrorScreen from "@ai/components/error-screen";
import { authOptions } from "@ai/pages/api/auth/[...nextauth]";

export default async function GamePage({
  params,
}: {
  params: { code: string; gameId: number };
}) {
  const session = await getServerSession(authOptions());

  const sessionToken = cookies().get("next-auth.session-token");

  if (!session || !sessionToken) {
    redirect("/");
  }

  const gameInfo = await getGameInfo(params.gameId, sessionToken.value);

  console.log("[GAME INFO]", gameInfo);

  if ("error" in gameInfo) {
    return (
      <ErrorScreen
        details={`A game for the room "${params.code}" does not exist.`}
      />
    );
  }

  return <Game gameInfo={gameInfo} session={session} />;
}
