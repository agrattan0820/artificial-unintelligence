import { getGameInfo } from "@ai/app/server-actions";
import Game from "./game";
import { State, StateFrom } from "xstate";
import { gameMachine } from "@ai/app/game/[code]/game-machine";

export default async function GamePage({
  params,
}: {
  params: { code: string };
}) {
  const gameInfo = await getGameInfo(params.code);

  // const gameState: StateFrom<typeof gameMachine> | null =
  //   gameInfo.game.state !== "START_GAME"
  //     ? State.create(JSON.parse(gameInfo.game.state))
  //     : null;

  return <Game gameInfo={gameInfo} />;
}
