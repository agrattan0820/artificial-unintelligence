import { getGameInfo } from "@ai/app/server-actions";
import Game from "./game";
import ErrorScreen from "@ai/components/error-screen";

export default async function GamePage({
  params,
}: {
  params: { code: string };
}) {
  const gameInfo = await getGameInfo(params.code);

  console.log("[GAME INFO]", gameInfo);

  if ("error" in gameInfo) {
    return (
      <ErrorScreen
        details={`A game for the room "${params.code}" does not exist.`}
      />
    );
  }

  return <Game roomCode={params.code} gameInfo={gameInfo} />;
}
