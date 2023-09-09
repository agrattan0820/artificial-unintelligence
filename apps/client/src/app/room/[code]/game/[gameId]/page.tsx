import { getGameInfo } from "@ai/app/server-actions";
import Game from "./game";
import ErrorScreen from "@ai/components/error-screen";
import { getServerSession } from "next-auth";
import { authOptions } from "@ai/pages/api/auth/[...nextauth]";
import { redirect } from "next/navigation";

export default async function GamePage({
  params,
}: {
  params: { code: string };
}) {
  const session = await getServerSession(authOptions());

  if (!session) {
    redirect("/");
  }

  const gameInfo = await getGameInfo(params.code);

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
