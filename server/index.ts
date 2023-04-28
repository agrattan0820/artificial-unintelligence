import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { Server, Socket } from "socket.io";
import { createServer } from "http";

dotenv.config();

const app: Express = express();
const server = createServer(app);
const port = process.env.PORT;

interface ServerToClientEvents {}

interface ClientToServerEvents {
  customEvent: (str: string) => void;
}

const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("customEvent", (str) => {
    console.log("custom event happened!", str);
  });
});

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

server.listen(port, () => {
  console.log(`listening on *:${port}`);
});
