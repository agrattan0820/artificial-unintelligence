import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { Server, Socket } from "socket.io";
import { createServer } from "http";
import * as crypto from "crypto";
import cors from "cors";

import { Room, User } from "./db/schema";
import { userRoutes } from "./src/routes/user.route";
import { roomRoutes } from "./src/routes/room.route";

export interface ServerToClientEvents {
  hello: (str: string) => void;
}

export interface ClientToServerEvents {
  createHost: (
    data: { nickname: string },
    callback: (response: { host: User; room: Room }) => void
  ) => void;
  joinRoom: (
    data: { user: User; room: Room },
    callback: (response: { host: User; room: Room; players: User[] }) => void
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
