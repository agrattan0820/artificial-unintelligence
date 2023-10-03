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
import { ClientToServerEvents, ServerToClientEvents } from "./types";
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
import { paymentRoutes } from "./routes/payment.route";
import { paymentWebhookController } from "./controllers/payment.controller";
import redis from "./redis";

export function buildServer() {
  const app: Express = express();
  const server = createServer(app);

  Sentry.init({
    dsn: "https://94861f92f5354fe0ae1a921b9a55d909@o4505598670209024.ingest.sentry.io/4505598751211520",
    integrations: [
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({
        tracing: true,
      }),
      // enable Express.js middleware tracing
      new Sentry.Integrations.Express({
        app,
      }),
    ],
    // Performance Monitoring
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.5 : 1.0,
  });

  // Express middleware
  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());
  app.use(
    cors({
      methods: ["GET", "POST"],
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
    const isIPBlocked = await redis.get(`BLOCKED_${req.ip}`);

    if (isIPBlocked) {
      res.status(429).send("Too many requests - try again tomorrow");
      return;
    }

    let redisIncr: number;
    try {
      redisIncr = await redis.incr(req.ip);
    } catch (error) {
      console.error(`Could not increment rate limit key for ${req.ip}`);
      throw error;
    }
    if (redisIncr > 10) {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      await redis.set(`BLOCKED_${req.ip}`, tomorrow.toISOString());
      await redis.expireat(
        `BLOCKED_${req.ip}`,
        Math.floor(tomorrow.getTime() / 1000)
      );
      console.log("Blocked the IP Address:", req.ip);
      res.status(429).send("Too many requests - try again tomorrow");
      return;
    }
    await redis.expire(req.ip, 10);

    next();
  });

  // Session check
  app.use(async (req, res, next) => {
    let sessionToken = "";

    const safeGETURLs = ["/ping", "/room", "/payment/webhook"];
    const safePOSTURLs = ["/payment/webhook"];

    if (
      safeGETURLs.some((url) => req.url.includes(url)) &&
      req.method === "GET"
    ) {
      next();
      return;
    }
    if (
      safePOSTURLs.some((url) => req.url.includes(url)) &&
      req.method === "POST"
    ) {
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

  // Define payment webhook before specifying json middleware
  app.post(
    "/payment/webhook",
    express.raw({ type: "application/json" }),
    paymentWebhookController
  );

  app.use(express.json());

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
  paymentRoutes(app);

  // Error handlers
  app.use(Sentry.Handlers.errorHandler());
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
