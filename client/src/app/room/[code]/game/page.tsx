import { generateQuestion, getGameInfo } from "@ai/app/server-actions";
import Game from "./game";

export default async function GamePage({
  params,
}: {
  params: { code: string };
}) {
  const gameInfo = await getGameInfo(params.code);

  return <Game gameInfo={gameInfo} />;
}
