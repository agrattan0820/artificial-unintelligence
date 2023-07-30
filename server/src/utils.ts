import { Socket } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents } from "./types";

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
  e: Error,
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
  code?: string
) {
  console.error("Socket Error: ", e);
  socket.emit("error", e.message);
  if (code) socket.to(code).emit("error", e.message);
}
