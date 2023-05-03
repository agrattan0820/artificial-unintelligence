import { io } from "socket.io-client";

const URL =
  process.env.NODE_ENV === "production"
    ? "http://localhost:8080" // TODO: change to API_URL
    : "http://localhost:8080";

export const socket = io(URL);
