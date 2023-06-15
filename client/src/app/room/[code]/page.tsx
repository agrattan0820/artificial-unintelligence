import RoomLink from "./room-link";
import UserCount from "@ai/components/user-count";
import ConnectionStatus from "@ai/components/connection-status";
import { useStore } from "@ai/utils/store";
import StoreInitializer from "@ai/utils/store-initializer";
import { getRoomInfo } from "@ai/app/server-actions";
import PlayerPresence from "@ai/utils/player-presence";
import UserList from "./user-list";
import StartGame from "./start-game";
import Lobby from "./lobby";

export default async function Room({ params }: { params: { code: string } }) {
  const roomInfo = await getRoomInfo(params.code);

  return (
    <>
      <Lobby roomInfo={roomInfo} />
    </>
  );
}
