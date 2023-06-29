import { getGameInfo } from "@ai/app/server-actions";
import Game from "./game";

export default async function GamePage({
  params,
}: {
  params: { code: string };
}) {
  const gameInfo = await getGameInfo(params.code);

  console.log("GAME INFO", gameInfo);

  return <Game gameInfo={gameInfo} />;
}
