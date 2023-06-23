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
import { waitFor } from "xstate/lib/waitFor";

import { Room, RoomInfo, User } from "../db/schema";
import { userRoutes } from "./routes/user.route";
import { roomRoutes } from "./routes/room.route";
import { getRoom, joinRoom, leaveRoom } from "./services/room.service";
import { createGame, getGameInfo, updateGame } from "./services/game.service";
import { serverMachine } from "./server-machine";
import { ClientToServerEvents, ServerToClientEvents } from "./types";
import { getGameRoundGenerations } from "./services/generation.service";
import { getQuestionVotes } from "./services/question.service";
import { gameRoutes } from "./routes/game.route";
import { questionRoutes } from "./routes/question.route";

export function buildServer() {
  const app: Express = express();
  const server = createServer(app);

  const inProgressRoomSet = new Set<string>();
  const gameStateMap = new Map<number, { state: string; round: number }>();

  app.use(express.json());
  app.use(cors());
  app.use(morgan("tiny"));

  const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("[CONNECTION]", socket.id);

    socket.on("connectToRoom", async (code) => {
      const userId = socket.handshake.auth.userId;
      let roomInfo = await getRoom({ code });

      if (
        roomInfo &&
        !roomInfo.players.find((player) => player.id === userId)
      ) {
        const userJoinRoom = await joinRoom({ userId: userId, code });
        roomInfo = await getRoom({ code });
      }

      if (!roomInfo) {
        socket.emit("message", `Unable to connect to room`);
        return;
      }

      socket.join(code);
      socket.to(code).emit("message", `${userId} joined`);
      socket.to(code).emit("roomState", roomInfo);
    });

    socket.on("leaveRoom", async ({ userId, code }) => {
      const leaveRoomEntry = await leaveRoom({ userId, code });
      const roomInfo = await getRoom({ code });

      if (!roomInfo) {
        socket.emit("message", `Unable to leave room`);
        return;
      }

      socket.leave(code);
      socket.to(code).emit("message", `${socket.handshake.auth.userId} left`);
      socket.to(code).emit("roomState", roomInfo);
    });

    socket.on("initiateGame", async (code) => {
      inProgressRoomSet.add(code);

      const newGame = await createGame({ code });

      const gameService = interpret(
        serverMachine.withContext({ socket: socket, round: 1 })
      ).onTransition((state, action) => {
        console.log("ON TRANSITION", state.value);
        socket.emit("serverEvent", {
          type: action.type,
        });
        socket.to(code).emit("serverEvent", {
          type: action.type,
        });
      });

      gameService.start();

      gameStateMap.set(newGame.id, {
        state: newGame.state,
        round: newGame.round,
      });

      // TODO: `socket.in` which is supposed to send to members including the sender is not working as expected, using two emits as a workaround
      socket.emit("startGame");
      socket.to(code).emit("startGame");
    });

    socket.on("clientEvent", async ({ state, gameId, round }) => {
      const gameState = gameStateMap.get(gameId);

      if (gameState && gameState?.state !== state) {
        gameStateMap.set(gameId, { state, round });
        const updatedGame = await updateGame({ state, gameId, round });
      }
    });

    socket.on("generationSubmitted", async ({ gameId, round }) => {
      // Receive gameId, and current round number
      // Check if game has all possible generations submitted for the current round
      // 2 x # of players is number of total needed generations
      const gameInfo = await getGameInfo({ gameId });

      if (!gameInfo) {
        socket.emit("message", `Unable to find game with gameId`);
        return;
      }

      const gameRoundGenerations = getGameRoundGenerations({ gameId, round });

      const totalNeeded = gameInfo.room.players.length * 2;
      const currentAmount = (await gameRoundGenerations).length;

      if (currentAmount >= totalNeeded) {
        socket.emit("serverEvent", {
          type: "NEXT",
        });
        socket.to(gameInfo.room.code).emit("serverEvent", {
          type: "NEXT",
        });
      }
    });

    socket.on("voteSubmitted", async ({ gameId, questionId }) => {
      // Receive gameId, questionId
      // Check if all votes are supplied for the given question
      // # of players - 2 is number of total votes needed
      const gameInfo = await getGameInfo({ gameId });

      if (!gameInfo) {
        socket.emit("message", `Unable to find game with gameId`);
        return;
      }

      const questionVotes = await getQuestionVotes({ gameId, questionId });

      const totalNeeded = gameInfo.room.players.length - 2;

      if (questionVotes.length >= totalNeeded) {
        socket.emit("serverEvent", {
          type: "NEXT",
        });
        socket.to(gameInfo.room.code).emit("serverEvent", {
          type: "NEXT",
        });
      }
    });

    socket.on("disconnecting", async () => {
      const intersect = new Set(
        [...socket.rooms].filter((room) => inProgressRoomSet.has(room))
      );

      if (intersect.size === 0) {
        await Promise.all(
          [...socket.rooms].map(async (room) => {
            const leaveRoomEntry = await leaveRoom({
              userId: socket.handshake.auth.userId,
              code: room,
            });
            const roomInfo = await getRoom({ code: room });

            if (!roomInfo) {
              socket.emit("message", `Unable to fully disconnect from room`);
              return;
            }

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
  gameRoutes(app);
  questionRoutes(app);

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
