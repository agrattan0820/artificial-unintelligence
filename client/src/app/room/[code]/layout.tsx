import SocketProvider from "@ai/utils/socket-provider";

export default function RoomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SocketProvider>{children}</SocketProvider>;
}
