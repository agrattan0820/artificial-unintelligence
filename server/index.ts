import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { Server, Socket } from "socket.io";
import { createServer } from "http";

// Load .env file before importing db
dotenv.config();

import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "./db/db";
import { NewUser, users } from "./db/schema";

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

  socket.on("customEvent", async (str) => {
    console.log("custom event happened!", str);
    const newUser: NewUser = {
      fullName: "John Doe",
      phone: "+123456789",
    };
    const insertedUsers = await db.insert(users).values(newUser).returning();
    console.log("insertedUsers", insertedUsers);
  });
});

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

server.listen(port, async () => {
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log(`listening on *:${port}`);
});
