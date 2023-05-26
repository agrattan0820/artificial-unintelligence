import express, { Express, Request, Response } from "express";
import { Server, Socket } from "socket.io";
import { createServer } from "http";
import cors from "cors";

import { Room, User } from "./db/schema";
import { userRoutes } from "./src/routes/user.route";
import { roomRoutes } from "./src/routes/room.route";
import { getRoom } from "./src/services/room.service";

export interface ServerToClientEvents {
  hello: (str: string) => void;
  message: (str: string) => void;
  updateRoom: (roomInfo: Awaited<ReturnType<typeof getRoom>>) => void;
  error: (str: string) => void;
}

export interface ClientToServerEvents {
  // createHost: (
  //   data: { nickname: string },
  //   callback: (response: { host: User; room: Room }) => void
  // ) => void;
  connectToRoom: (code: string) => void;
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

    socket.emit("hello", "hello world");

    socket.on("connectToRoom", (code) => {
      socket.join(code);
    });

    userRoutes(app, socket);
    roomRoutes(app, socket);
  });

  app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
  });
  app.get("/ping", (req: Request, res: Response) => {
    res.status(200).send("pong");
  });

  return server;
}
