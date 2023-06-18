import express, {
  ErrorRequestHandler,
  Express,
  NextFunction,
  Request,
  Response,
} from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import morgan from "morgan";
import { interpret, InterpreterFrom } from "xstate";

import { Room, RoomInfo, User } from "../db/schema";
import { userRoutes } from "./routes/user.route";
import { roomRoutes } from "./routes/room.route";
import { getRoom, joinRoom, leaveRoom } from "./services/room.service";
import { createGame } from "./services/game.service";
import { serverMachine } from "./server-machine";
import { ClientToServerEvents, ServerToClientEvents } from "./types";

export function buildServer() {
  const app: Express = express();
  const server = createServer(app);

  const gameStateMachineMap = new Map<
    string,
    InterpreterFrom<typeof serverMachine>
  >();
  const inProgressGameSet = new Set<string>();

  app.use(express.json());
  app.use(cors());
  app.use(morgan("tiny"));

  const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    socket.emit("hello", `hello world ${socket.handshake.auth.userId}`);

    console.log("[CONNECTION]", socket.id);

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

    socket.on("initiateGame", async (code) => {
      const newGame = await createGame({ code });

      const gameActor = interpret(
        serverMachine.withContext({ socket: socket, round: 1 })
      );

      inProgressGameSet.add(code);

      // socket.to(code).emit("gameEvent", {
      //   type: "NEXT",
      // });

      // TODO: `socket.in` which is supposed to send to members including the sender is not working as expected, using two emits as a workaround
      socket.emit("startGame");
      socket.to(code).emit("startGame");
      // socket.to(code).emit("message", "SENT EVENT");

      // gameStateMachineMap.set(code, gameActor);
    });

    // If the current state requires a timer, initiate it on the server and wait for it to complete
    // If all prompts/votes come in to the server before time's up, go to next state, if not wait until time's up to go to next state

    socket.on("disconnecting", async () => {
      const intersect = new Set(
        [...socket.rooms].filter((room) => inProgressGameSet.has(room))
      );

      if (intersect.size === 0) {
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
      }
    });
  });

  app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
  });
  app.get("/ping", (req: Request, res: Response) => {
    res.status(200).send("pong");
  });

  userRoutes(app);
  roomRoutes(app);

  const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (res.headersSent) {
      return next(err);
    }
    console.error(err.stack);
    const status = "status" in err ? (err.status as number) : 500;
    res.status(status).send(err.message);
  };
  app.use(errorHandler);

  return server;
}
