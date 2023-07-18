import express, {
  ErrorRequestHandler,
  Express,
  Request,
  Response,
} from "express";
import { Server, Socket } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";

import { userRoutes } from "./routes/user.route";
import { roomRoutes } from "./routes/room.route";
import { getRoom, joinRoom, leaveRoom } from "./services/room.service";
import {
  addUsersToGame,
  createGame,
  getGameInfo,
  updateGame,
} from "./services/game.service";
import { ClientToServerEvents, ServerToClientEvents } from "./types";
import {
  createGeneration,
  getGameRoundGenerations,
  getSubmittedPlayers,
} from "./services/generation.service";
import { assignQuestionsToPlayers } from "./services/question.service";
import { gameRoutes } from "./routes/game.route";
import { questionRoutes } from "./routes/question.route";
import {
  calculateVotePoints,
  createVote,
  getVotesByQuestionId,
} from "./services/vote.service";
import { generationRoutes } from "./routes/generation.route";
import { Generation } from "../db/schema";

export function buildServer() {
  const app: Express = express();
  const server = createServer(app);

  const gameStateMap = new Map<number, { state: string; round: number }>();

  app.use(express.json());
  app.use(cors());
  app.use(helmet());
  app.use(morgan("tiny"));

  const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
    cors: {
      origin: "*",
    },
  });

  const handleSocketIOError = (
    e: Error,
    socket: Socket<ClientToServerEvents, ServerToClientEvents>,
    code?: string
  ) => {
    console.error("Socket.io Error: ", e);
    socket.emit("error", e.message);
    if (code) socket.to(code).emit("error", e.message);
  };

  io.engine.use(helmet());

  io.on("connection", async (socket) => {
    console.log("[CONNECTION]", socket.id);

    if (socket.handshake.auth.userId && socket.handshake.auth.roomCode) {
      const userId = Number(socket.handshake.auth.userId);
      const code: string = socket.handshake.auth.roomCode;
      socket.join(code);
      try {
        console.log(`[CHECKING IF ${userId} IS IN ROOM ${code}]`);
        const roomInfo = await getRoom({ code });
        if (
          roomInfo &&
          !roomInfo.players.some((player) => player.id === userId)
        )
          await joinRoom({ userId, code });
        const updatedRoomInfo = await getRoom({ code });
        if (updatedRoomInfo) {
          socket.emit("roomState", updatedRoomInfo);
          socket.to(code).emit("roomState", updatedRoomInfo);
        }
      } catch (error) {
        if (error instanceof Error) handleSocketIOError(error, socket, code);
      }
    }

    socket.on("connectToRoom", async (code) => {
      try {
        const userId = Number(socket.handshake.auth.userId);
        let roomInfo = await getRoom({ code });

        if (
          roomInfo &&
          !roomInfo.players.some((player) => player.id === userId)
        ) {
          await joinRoom({ userId: userId, code });
          roomInfo = await getRoom({ code });
        }

        if (!roomInfo) {
          socket.emit("message", `Unable to connect to room`);
          return;
        }

        socket.join(code);
        socket.to(code).emit("roomState", roomInfo);
      } catch (error) {
        if (error instanceof Error) handleSocketIOError(error, socket, code);
      }
    });

    socket.on("leaveRoom", async ({ userId, code }) => {
      try {
        await leaveRoom({ userId, code });
        const roomInfo = await getRoom({ code });

        if (!roomInfo) {
          socket.emit("message", `Unable to get room info when leaving`);
          return;
        }

        socket.leave(code);
        socket.to(code).emit("message", `${socket.handshake.auth.userId} left`);
        socket.to(code).emit("roomState", roomInfo);
      } catch (error) {
        if (error instanceof Error) handleSocketIOError(error, socket, code);
      }
    });

    socket.on("initiateGame", async (code) => {
      try {
        const newGame = await createGame({ code });

        gameStateMap.set(newGame.id, {
          state: newGame.state,
          round: newGame.round,
        });

        const roomInfo = await getRoom({ code });

        if (!roomInfo?.players) {
          throw new Error(
            "The room's players were not defined when initiating the game"
          );
        }

        await addUsersToGame({
          gameId: newGame.id,
          players: roomInfo?.players,
        });

        await assignQuestionsToPlayers({
          gameId: newGame.id,
          players: roomInfo?.players,
        });

        socket.emit("startGame"); // `socket.in` which is supposed to send to members including the sender is not working as expected, using two emits as a workaround
        socket.to(code).emit("startGame");
      } catch (error) {
        if (error instanceof Error) handleSocketIOError(error, socket, code);
      }
    });

    // TODO: this code uses the same functions as `initiateGame`, think about refactoring
    socket.on("playAnotherGame", async (code) => {
      try {
        const newGame = await createGame({ code });

        console.log("[PLAY ANOTHER GAME]", newGame);

        gameStateMap.set(newGame.id, {
          state: newGame.state,
          round: newGame.round,
        });

        const roomInfo = await getRoom({ code });

        if (!roomInfo?.players) {
          throw new Error(
            "The room's players were not defined when initiating the game"
          );
        }

        await addUsersToGame({
          gameId: newGame.id,
          players: roomInfo?.players,
        });

        await assignQuestionsToPlayers({
          gameId: newGame.id,
          players: roomInfo?.players,
        });

        socket.emit("serverEvent", {
          type: "NEXT",
        });
        socket.to(code).emit("serverEvent", {
          type: "NEXT",
        });
      } catch (error) {
        if (error instanceof Error) handleSocketIOError(error, socket);
      }
    });

    // TODO: add `socket.on("gameFinished")

    socket.on("clientEvent", async ({ state, gameId, round }) => {
      try {
        const gameState = gameStateMap.get(gameId);

        if (gameState && gameState?.state !== state) {
          gameStateMap.set(gameId, { state, round });
          await updateGame({ state, gameId, round });
        }
      } catch (error) {
        if (error instanceof Error) handleSocketIOError(error, socket);
      }
    });

    socket.on("testEvent", async (code) => {
      console.log("[TEST EVENT]", code);

      const sockets = await io.in(code).fetchSockets();

      console.log(
        "SOCKETS IN ROOM",
        sockets.map((socket) => socket.handshake.auth.userId)
      );
    });

    socket.on("generationSubmitted", async (data) => {
      try {
        // Receive gameId, and current round number
        // Check if game has all possible generations submitted for the current round
        // 2 x # of players is number of total needed generations
        const gameInfo = await getGameInfo({ gameId: data.gameId });

        if (!gameInfo) {
          socket.emit("error", `Unable to find game with gameId`);
          return;
        }

        await createGeneration(data);

        const gameRoundGenerations = await getGameRoundGenerations({
          gameId: data.gameId,
          round: data.round,
        });

        const submittedUsers = getSubmittedPlayers({ gameRoundGenerations });

        socket.emit("submittedPlayers", submittedUsers);
        socket
          .to(gameInfo.game.roomCode)
          .emit("submittedPlayers", submittedUsers);

        const totalNeeded = gameInfo.players.length * 2;
        const currentAmount = gameRoundGenerations.length;

        console.log("[TOTAL NEEDED]", totalNeeded);

        const sockets = await io.in(gameInfo.game.roomCode).fetchSockets();

        console.log(
          "[SOCKETS IN ROOM]",
          sockets.map((socket) => socket.handshake.auth.userId)
        );

        if (currentAmount >= totalNeeded) {
          console.log("[SENDING SERVER EVENTS]", gameInfo.game.roomCode);
          socket.emit("serverEvent", {
            type: "NEXT",
          });
          socket.to(gameInfo.game.roomCode).emit("serverEvent", {
            type: "NEXT",
          });
        }
      } catch (error) {
        if (error instanceof Error) handleSocketIOError(error, socket);
      }
    });

    socket.on("voteSubmitted", async (data) => {
      try {
        // Receive gameId, questionId
        // Check if all votes are supplied for the given question
        // # of players - 2 is number of total votes needed
        const gameInfo = await getGameInfo({ gameId: data.gameId });

        if (!gameInfo) {
          socket.emit("error", `Unable to find game with gameId`);
          return;
        }

        await createVote({
          userId: data.userId,
          generationId: data.generationId,
        });

        const questionVotes = await getVotesByQuestionId({
          questionId: data.questionId,
        });

        socket.emit("votedPlayers", questionVotes);
        socket.to(gameInfo.game.roomCode).emit("votedPlayers", questionVotes);

        const totalNeeded = gameInfo.players.length - 2; // assuming 3+ players
        const currentAmount = questionVotes.length;

        if (currentAmount >= totalNeeded) {
          const gameRoundGenerations = await getGameRoundGenerations({
            gameId: data.gameId,
            round: gameInfo.game.round,
          });

          const filteredGenerations = gameRoundGenerations.reduce<Generation[]>(
            (acc, curr) => {
              if (curr.question.id === data.questionId) {
                acc.push(curr.generation);
              }

              return acc;
            },
            []
          );

          await calculateVotePoints({
            generations: filteredGenerations,
            userVotes: questionVotes,
            gameId: data.gameId,
          });

          socket.emit("serverEvent", {
            type: "NEXT",
          });
          socket.to(gameInfo.game.roomCode).emit("serverEvent", {
            type: "NEXT",
          });
        }
      } catch (error) {
        if (error instanceof Error) handleSocketIOError(error, socket);
      }
    });

    socket.on("disconnecting", async () => {
      try {
        await Promise.all(
          [...socket.rooms].map(async (room) => {
            await leaveRoom({
              userId: Number(socket.handshake.auth.userId),
              code: room,
            });
            const roomInfo = await getRoom({ code: room });

            if (!roomInfo) {
              socket.emit("error", `Unable to fully disconnect from room`);
              return;
            }

            socket
              .to(room)
              .emit("message", `${socket.handshake.auth.userId} left`);
            socket.to(room).emit("roomState", roomInfo);
          })
        );
      } catch (error) {
        if (error instanceof Error) handleSocketIOError(error, socket);
      }
    });
  });

  app.get("/", (req: Request, res: Response) => {
    res.send("beeeeeeeep server");
  });
  app.get("/ping", (req: Request, res: Response) => {
    res.status(200).send("pong");
  });

  userRoutes(app);
  roomRoutes(app);
  gameRoutes(app);
  questionRoutes(app);
  generationRoutes(app);

  const expressErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (res.headersSent) {
      return next(err);
    }
    console.error(err.stack);
    const status = "status" in err ? (err.status as number) : 500;
    res.status(status).send(err.message);
  };
  app.use(expressErrorHandler);

  return server;
}
