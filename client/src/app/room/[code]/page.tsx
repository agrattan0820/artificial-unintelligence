import RoomLink from "./room-link";
import UserCount from "@ai/components/user-count";
import ConnectionStatus from "@ai/components/connection-status";
import { useStore } from "@ai/utils/store";
import StoreInitializer from "@ai/utils/store-initializer";
import { getRoomInfo } from "@ai/app/actions";
import PlayerPresence from "@ai/utils/player-presence";

export default async function Room({ params }: { params: { code: string } }) {
  const roomInfo = await getRoomInfo(params.code);

  const { players, ...room } = roomInfo;

  useStore.setState({ room, players });

  return (
    <main className="flex min-h-screen flex-col justify-center">
      <StoreInitializer room={room} players={players} />
      <PlayerPresence code={room.code} />
      <section className="container mx-auto px-4">
        <p className="mb-2 text-center font-space text-xl">Your Room Link is</p>
        <RoomLink code={params.code} />
        <div className="absolute left-8 top-8">
          <UserCount code={params.code} initialCount={players.length} />
        </div>
        <ConnectionStatus code={params.code} />
      </section>
    </main>
  );
}
