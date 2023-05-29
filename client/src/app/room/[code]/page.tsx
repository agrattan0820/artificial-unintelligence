import RoomLink from "./room-link";
import UserCount from "@ai/components/user-count";
import ConnectionStatus from "@ai/components/connection-status";
import { useStore } from "@ai/utils/store";
import StoreInitializer from "@ai/utils/store-initializer";
import { getRoomInfo } from "@ai/app/actions";

export default async function Room({ params }: { params: { code: string } }) {
  // const roomResponse = await fetch(`http://localhost:8080/room/${params.code}`);

  // const roomData: GetRoomResponse = await roomResponse.json();

  const room = await getRoomInfo(params.code);

  useStore.setState({ room });

  return (
    <main className="flex min-h-screen flex-col justify-center">
      {/* <StoreInitializer room={room} /> */}
      <section className="container mx-auto px-4">
        <p className="mb-2 text-center font-space text-xl">Your Room Link is</p>
        <RoomLink code={params.code} />
        <div className="absolute left-8 top-8">
          <UserCount code={params.code} initialCount={room.players.length} />
        </div>
        <ConnectionStatus code={params.code} />
      </section>
    </main>
  );
}
