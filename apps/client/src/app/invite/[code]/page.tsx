import { getServerSession } from "next-auth";
import type { Game } from "database";

import { getRoomInfo } from "@ai/utils/queries";
import { authOptions } from "@ai/pages/api/auth/[...nextauth]";
import { getRunningGame } from "@ai/utils/server-actions";
import HomepageTemplate from "@ai/components/homepage-template";

export default async function Invite({ params }: { params: { code: string } }) {
  const roomInfo = await getRoomInfo(params.code);

  const session = await getServerSession(authOptions());

  let runningGame: Game | null = null;

  if (session) {
    const runningGameQuery = await getRunningGame({ session });

    if (runningGameQuery) {
      runningGame = runningGameQuery.game as Game;
    }
  }

  return (
    <HomepageTemplate
      session={session}
      runningGame={runningGame}
      roomInfo={roomInfo}
      formLabel="Join Game"
      type="INVITE"
    />
  );
}
