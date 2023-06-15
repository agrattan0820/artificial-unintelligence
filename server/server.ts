import express, { Express, Request, Response } from "express";
import { Server, Socket } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import morgan from "morgan";
import errorhandler from "errorhandler";

import { Room, RoomInfo, User } from "./db/schema";
import { userRoutes } from "./src/routes/user.route";
import { roomRoutes } from "./src/routes/room.route";
import { getRoom, joinRoom, leaveRoom } from "./src/services/room.service";

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
  leaveRoom: (data: { userId: number; code: string }) => void;
}

export function buildServer() {
  const app: Express = express();
  const server = createServer(app);

  app.use(express.json());
  app.use(cors());
  app.use(morgan("tiny"));

  if (process.env.NODE_ENV === "development") {
    app.use(errorhandler());
  }

  const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    socket.emit("hello", `hello world ${socket.handshake.auth.userId}`);

    socket.on("connectToRoom", async (code) => {
      const userId = socket.handshake.auth.userId;
      let roomInfo = await getRoom({ code });

      if (!roomInfo.players.find((player) => player.id === userId)) {
        const userJoinRoom = await joinRoom({ userId: userId, code });
        roomInfo = await getRoom({ code });
      }
      socket.join(code);
      socket.to(code).emit("message", `${userId} joined`);
      socket.to(code).emit("roomState", roomInfo);
    });

    socket.on("leaveRoom", async ({ userId, code }) => {
      const leaveRoomEntry = await leaveRoom({ userId, code });
      const roomInfo = await getRoom({ code });
      socket.leave(code);
      socket.to(code).emit("message", `${socket.handshake.auth.userId} left`);
      socket.to(code).emit("roomState", roomInfo);
    });

    socket.on("disconnecting", async () => {
      await Promise.all(
        [...socket.rooms].map(async (room) => {
          const leaveRoomEntry = await leaveRoom({
            userId: socket.handshake.auth.userId,
            code: room,
          });
          const roomInfo = await getRoom({ code: room });
          socket
            .to(room)
            .emit("message", `${socket.handshake.auth.userId} left`);
          socket.to(room).emit("roomState", roomInfo);
        })
      );
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
