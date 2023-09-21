import { authOptions } from "@ai/pages/api/auth/[...nextauth]";
import QueryProvider from "@ai/utils/query-provider";
import SocketProvider from "@ai/utils/socket-provider";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function RoomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions());

  if (!session) {
    redirect("/");
  }

  return (
    <QueryProvider>
      <SocketProvider session={session}>{children}</SocketProvider>
    </QueryProvider>
  );
}
