import { getRoomInfo } from "@ai/app/server-actions";
import NicknameForm from "@ai/components/nickname-form";

export default async function Invite({ params }: { params: { code: string } }) {
  const roomInfo = await getRoomInfo(params.code);

  return (
    <main className="flex min-h-screen flex-col justify-center">
      <section className="container mx-auto px-4">
        <h1 className="mb-8 text-6xl">beeeeeeeep</h1>
        <NicknameForm room={roomInfo} type="INVITE" submitLabel="Join Game" />
      </section>
    </main>
  );
}
