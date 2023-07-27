import { getRoomInfo } from "@ai/app/server-actions";
import Lobby from "./lobby";
import { LinkButton } from "@ai/components/button";
import ErrorScreen from "@ai/components/error-screen";

export default async function Room({ params }: { params: { code: string } }) {
  const roomInfo = await getRoomInfo(params.code);

  console.log("[ROOM INFO]", roomInfo);

  if ("error" in roomInfo) {
    return (
      <ErrorScreen
        details={`A room with code "${params.code}" does not exist.`}
      />
    );
  }

  return <Lobby roomInfo={roomInfo} />;
}
