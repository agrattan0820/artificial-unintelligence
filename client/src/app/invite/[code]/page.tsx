import NicknameForm from "@ai/components/nickname-form";
import { GetRoomResponse } from "@ai/types/api.type";

export default async function Invite({ params }: { params: { code: string } }) {
  const roomResponse = await fetch(`http://localhost:8080/room/${params.code}`);

  const roomData: GetRoomResponse = await roomResponse.json();

  return (
    <main className="flex min-h-screen flex-col justify-center">
      <section className="container mx-auto px-4">
        <h1 className="mb-8 text-6xl">beeeeeeeep</h1>
        <NicknameForm
          room={roomData.room}
          type="INVITE"
          submitLabel="Start Game"
        />
      </section>
    </main>
  );
}
