import { authOptions } from "@ai/pages/api/auth/[...nextauth]";
import QueryProvider from "@ai/utils/query-provider";
import SocketProvider from "@ai/utils/socket-provider";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import * as Sentry from "@sentry/nextjs";

export default async function RoomLayout({
  children,
}: LayoutProps<"/room/[code]">) {

  const session = await getServerSession(authOptions());

  if (!session) {
    redirect("/");
  }

  Sentry.setUser({
    id: session.user.id,
    email: session.user.email ?? "",
    username: session.user.nickname,
  });

  return (
    <QueryProvider>
      <SocketProvider session={session}>{children}</SocketProvider>
    </QueryProvider>
  );
}
