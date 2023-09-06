import { getRoomInfo } from "@ai/app/server-actions";
import Lobby from "./lobby";
import ErrorScreen from "@ai/components/error-screen";
import Footer from "@ai/components/footer";
import { getServerSession } from "next-auth";
import { authOptions } from "@ai/pages/api/auth/[...nextauth]";
import { redirect } from "next/navigation";

export default async function Room({ params }: { params: { code: string } }) {
  const roomInfo = await getRoomInfo(params.code);

  const session = await getServerSession(authOptions());

  console.log("[ROOM INFO]", roomInfo);

  if (!session) {
    redirect("/");
  }

  if ("error" in roomInfo) {
    return (
      <ErrorScreen
        details={`A room with code "${params.code}" does not exist.`}
      />
    );
  }

  return (
    <div>
      <Lobby roomInfo={roomInfo} session={session} />
      <Footer />
    </div>
  );
}
