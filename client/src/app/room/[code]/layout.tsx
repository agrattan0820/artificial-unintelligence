import QueryProvider from "@ai/utils/query-provider";
import SocketProvider from "@ai/utils/socket-provider";

export default function RoomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <SocketProvider>{children}</SocketProvider>
    </QueryProvider>
  );
}
