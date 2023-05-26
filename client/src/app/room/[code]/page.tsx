import SocketInitializer from "@ai/components/socket-initializer";
import RoomLink from "./room-link";
import UserCount from "@ai/components/user-count";
import { GetRoomResponse } from "@ai/types/api.type";
import ConnectionStatus from "@ai/components/connection-status";
import { socket } from "@ai/utils/socket";
import { useStore } from "@ai/utils/store";
import StoreInitializer from "@ai/utils/store-initializer";

export default async function Room({ params }: { params: { code: string } }) {
  const roomResponse = await fetch(`http://localhost:8080/room/${params.code}`);

  const roomData: GetRoomResponse = await roomResponse.json();

  useStore.setState({ room: roomData });

  return (
    <main className="flex min-h-screen flex-col justify-center">
      <StoreInitializer room={roomData} />
      <section className="container mx-auto px-4">
        <p className="mb-2 text-center font-space text-xl">Your Room Link is</p>
        <RoomLink code={params.code} />
        <div className="absolute left-8 top-8">
          <UserCount initialCount={roomData.players.length} />
        </div>
        <ConnectionStatus />
      </section>
      <SocketInitializer />
    </main>
  );
}
