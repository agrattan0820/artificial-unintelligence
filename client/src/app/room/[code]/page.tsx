import { getRoomInfo } from "@ai/app/server-actions";
import Lobby from "./lobby";

export default async function Room({ params }: { params: { code: string } }) {
  const roomInfo = await getRoomInfo(params.code);

  return (
    <>
      <Lobby roomInfo={roomInfo} />
    </>
  );
}
