import express, { Express, Request, Response } from "express";
import { Server, Socket } from "socket.io";
import { createServer } from "http";
import cors from "cors";

import { Room, RoomInfo, User } from "./db/schema";
import { userRoutes } from "./src/routes/user.route";
import { roomRoutes } from "./src/routes/room.route";
import { getRoom } from "./src/services/room.service";

export interface ServerToClientEvents {
  hello: (str: string) => void;
  message: (str: string) => void;
  roomState: (roomInfo: RoomInfo) => void;
  error: (str: string) => void;
}

export interface ClientToServerEvents {
  // createHost: (
  //   data: { nickname: string },
  //   callback: (response: { host: User; room: Room }) => void
  // ) => void;
  connectToRoom: (code: string) => void;
  leaveRoom: (code: string) => void;
  joinRoom: (
    data: { user: User; room: Room },
    callback: (response: Awaited<ReturnType<typeof getRoom>>) => void
  ) => void;
}

export function buildServer() {
  const app: Express = express();
  const server = createServer(app);

  app.use(express.json());
  app.use(cors());

  const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("[CONNECTION]");

    socket.emit("hello", `hello world ${socket.handshake.auth.userId}`);

    socket.on("connectToRoom", async (code) => {
      const roomInfo = await getRoom({ roomCode: code });
      socket.join(code);
      socket.to(code).emit("message", `${socket.handshake.auth.userId} joined`);
      socket.to(code).emit("roomState", roomInfo);
    });

    socket.on("leaveRoom", (code) => {
      socket.leave(code);
      socket.to(code).emit("message", `${socket.handshake.auth.userId} left`);
    });

    socket.on("disconnecting", () => {
      console.log(socket.rooms); // the Set contains at least the socket ID

      socket.rooms.forEach((room) => {
        socket.to(room).emit("message", `${socket.handshake.auth.userId} left`);
      });
    });

    userRoutes(app);
    roomRoutes(app);
  });

  app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
  });
  app.get("/ping", (req: Request, res: Response) => {
    res.status(200).send("pong");
  });

  return server;
}
