import { getRoomInfo } from "@ai/app/server-actions";
import ErrorScreen from "@ai/components/error-screen";
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
    <main className="mmin-h-[100dvh] flex flex-col justify-center">
      <section className="container mx-auto px-4">
        <h1 className="mb-8 text-6xl">
          artif<span className="">i</span>cial <br /> unintelligence
        </h1>
        <NicknameForm room={roomInfo} type="INVITE" submitLabel="Join Game" />
      </section>
    </main>
  );
}
