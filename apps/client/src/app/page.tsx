import { getServerSession } from "next-auth";
import { db, games, usersToGames } from "database";
import { isNull, and, eq, desc } from "drizzle-orm";
import { FiLogIn } from "react-icons/fi";

import Footer from "@ai/components/footer";
import Friend from "@ai/components/game/friend";
import SignInForm from "@ai/components/sign-in-form";
import { authOptions } from "@ai/pages/api/auth/[...nextauth]";
import { LinkSecondaryButton } from "@ai/components/button";

export default async function Home() {
  const session = await getServerSession(authOptions());

  let runningGameRoomCode = "";

  if (session) {
    const response = await db
      .select({
        game: games,
        usersToGames: usersToGames,
      })
      .from(games)
      .innerJoin(usersToGames, eq(games.id, usersToGames.gameId))
      .where(
        and(
          isNull(games.completedAt),
          eq(usersToGames.userId, session.user.id),
        ),
      )
      .orderBy(desc(games.createdAt));

    if (response.length > 0) {
      runningGameRoomCode = response[0].game.roomCode;
    }
  }

  return (
    <main className="relative flex min-h-[100dvh] flex-col justify-center">
      <section className="container mx-auto flex flex-col-reverse items-start justify-center gap-8 px-4 lg:flex-row lg:gap-24">
        {runningGameRoomCode && (
          <div className="absolute left-1/2 top-8 w-full -translate-x-1/2">
            <LinkSecondaryButton
              href={`/room/${runningGameRoomCode}/game`}
              className="mx-auto flex w-full max-w-fit items-center gap-2"
            >
              Join Back Into Game <FiLogIn />
            </LinkSecondaryButton>
          </div>
        )}
        <div>
          <h1 className="mb-8 text-4xl md:text-6xl">
            artif<span className="ml-0.5 inline-block">i</span>cial <br />{" "}
            unintelligence
          </h1>
          <SignInForm session={session} submitLabel="Host Game" type="HOME" />
        </div>
        <Friend className="w-32 lg:w-1/4" />
      </section>
      <Footer />
    </main>
  );
}
