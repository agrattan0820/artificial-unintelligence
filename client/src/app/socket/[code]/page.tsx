"use client";

import useSocket from "@ai/utils/hooks/use-socket";
import { useEffect } from "react";

export default async function SocketRoom({
  params,
}: {
  params: { code: string };
}) {
  const socket = useSocket({ roomCode: params.code });

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center">
      {/* <SocketInitializer roomCode={params.code} /> */}
      <p>Hello</p>
    </main>
  );
}
