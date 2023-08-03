import { getRoomInfo } from "@ai/app/server-actions";
import ErrorScreen from "@ai/components/error-screen";
import Friend from "@ai/components/game/friend";
import NicknameForm from "@ai/components/nickname-form";

export default async function Invite({ params }: { params: { code: string } }) {
  const roomInfo = await getRoomInfo(params.code);

  if ("error" in roomInfo) {
    return (
      <ErrorScreen
        details={`A room with code "${params.code}" does not exist.`}
      />
    );
  }

  return (
    <main className="flex min-h-[100dvh] flex-col justify-center">
      <section className="container mx-auto flex flex-col-reverse items-start justify-center gap-8 px-4 lg:flex-row lg:gap-24">
        <div>
          <h1 className="mb-8 text-4xl md:text-6xl">
            artif<span className="ml-0.5 inline-block">i</span>cial <br />{" "}
            unintelligence
          </h1>
          <NicknameForm room={roomInfo} type="INVITE" submitLabel="Join Game" />
        </div>
        <Friend className="w-32 lg:w-1/4" />
      </section>
    </main>
  );
}
