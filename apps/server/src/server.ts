import "./instrument";
import express, {
  ErrorRequestHandler,
  Express,
  Request,
  Response,
} from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import * as Sentry from "@sentry/node";

import { userRoutes } from "./routes/user.route";
import { roomRoutes } from "./routes/room.route";
import type { ClientToServerEvents, ServerToClientEvents } from "./types";
import { gameRoutes } from "./routes/game.route";
import { generationRoutes } from "./routes/generation.route";
import {
  checkIfExistingUser,
  connectionSocketHandlers,
} from "./handlers/connection.handler";
import { roomSocketHandlers } from "./handlers/room.handler";
import { gameSocketHandlers } from "./handlers/game.handler";
import { generationSocketHandlers } from "./handlers/generation.handler";
import { voteSocketHandlers } from "./handlers/vote.handler";
import { authSocketMiddleware } from "./middleware/auth.middleware";
import { checkUserSession } from "./services/user.service";
import redis from "./redis";

export function buildServer() {
  const app: Express = express();
  const server = createServer(app);

  // Express middleware
  app.use(express.json());
  app.use(
    cors({
      methods: ["GET", "POST", "DELETE"],
      origin: process.env.APP_URL ?? "https://www.artificialunintelligence.gg",
      credentials: true,
    })
  );
  app.use(helmet());
  app.use(morgan("tiny"));
  app.use(cookieParser());

  // Rate limiter
  // Based on https://redis.io/commands/incr#pattern-rate-limiter-1
  app.use(async (req, res, next) => {
    let redisIncr: number;
    if (req.ip) {
      try {
        redisIncr = await redis.incr(req.ip);
      } catch (error) {
        console.error(`Could not increment rate limit key for ${req.ip}`);
        throw error;
      }
      if (redisIncr > 10) {
        res.status(429).send("Too many requests - try again later");
        return;
      }
      await redis.expire(req.ip, 10);
    }

    next();
  });

  // Session check
  app.use(async (req, res, next) => {
    let sessionToken = "";

    const safeURLs = ["/ping", "/room"];

    if (safeURLs.some((url) => req.url.includes(url)) && req.method === "GET") {
      next();
      return;
    }

    if (req.headers.authorization) {
      sessionToken = req.headers.authorization?.split("Bearer ")[1];
    } else if (req.cookies["next-auth.session-token"]) {
      sessionToken = req.cookies["next-auth.session-token"];
    } else if (req.cookies["__Secure-next-auth.session-token"]) {
      sessionToken = req.cookies["__Secure-next-auth.session-token"];
    }

    if (!sessionToken) {
      res.status(401).send("Unauthorized");
      return;
    }

    const redisSession = await redis.get(sessionToken);

    if (!redisSession) {
      const checkDBForSession = await checkUserSession({ sessionToken });
      if (!checkDBForSession) {
        res.status(401).send("Unauthorized");
        return;
      }

      Sentry.setUser({ id: checkDBForSession.userId });

      await redis.set(sessionToken, checkDBForSession.userId);

      await redis.expireat(
        sessionToken,
        Math.floor(checkDBForSession.expires.getTime() / 1000)
      );
    } else {
      Sentry.setUser({ id: redisSession });
    }

    next();
  });

  // Websockets with socket.io
  const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
    cors: {
      origin: process.env.APP_URL ?? "https://www.artificialunintelligence.gg",
      credentials: true,
    },
  });

  io.engine.use(helmet());

  // Check for authenticated session
  authSocketMiddleware(io);

  // Socket.io events
  io.on("connection", async (socket) => {
    console.log("[CONNECTION]", socket.id);

    await checkIfExistingUser(io, socket);

    connectionSocketHandlers(io, socket);
    roomSocketHandlers(io, socket);
    gameSocketHandlers(io, socket);
    generationSocketHandlers(io, socket);
    voteSocketHandlers(io, socket);
  });

  // http routes
  app.get("/", (req: Request, res: Response) => {
    res.send("Artificial Unintelligence Server");
  });
  app.get("/ping", (req: Request, res: Response) => {
    res.status(200).send("pong");
  });
  userRoutes(app);
  roomRoutes(app);
  gameRoutes(app);
  generationRoutes(app);

  // Error handlers
  Sentry.setupExpressErrorHandler(app);
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
