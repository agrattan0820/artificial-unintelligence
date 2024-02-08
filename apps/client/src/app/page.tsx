import { getServerSession } from "next-auth/next";
import type { Game } from "database";

import { authOptions } from "@ai/pages/api/auth/[...nextauth]";
import { getRunningGame } from "@ai/utils/server-actions";
import HomepageTemplate from "@ai/components/homepage-template";

export default async function Home() {
  const session = await getServerSession(authOptions());

  let runningGame: Game | null = null;

  if (session) {
    const runningGameQuery = await getRunningGame({ session });

    if (runningGameQuery) {
      runningGame = runningGameQuery.game;
    }
  }

  return (
    <HomepageTemplate
      session={session}
      runningGame={runningGame}
      formLabel="Host Game"
      type="HOME"
    />
  );
}
