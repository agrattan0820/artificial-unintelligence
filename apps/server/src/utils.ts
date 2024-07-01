import * as Sentry from "@sentry/node";
import type { Socket } from "socket.io";
import type { ClientToServerEvents, ServerToClientEvents } from "./types";

export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

export function shuffleArray<T>(arr: T[]) {
  for (let i = 0; i < arr.length - 2; i++) {
    const randNum = getRandomInt(i, arr.length);
    const temp = arr[i];
    arr[i] = arr[randNum];
    arr[randNum] = temp;
  }

  return arr;
}

export function handleSocketError(
  error: Error,
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
  code?: string
) {
  console.error("Socket Error: ", error);
  socket.emit("error", error.message);
  Sentry.captureException(error);
  if (code) socket.to(code).emit("error", error.message);
}

export function parseCookie(cookieHeader: string) {
  return cookieHeader
    .split(";")
    .map((v) => v.split("="))
    .reduce(
      (acc, v) => {
        acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
        return acc;
      },
      {} as Record<string, string>
    );
}
