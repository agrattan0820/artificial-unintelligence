import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { Server, Socket } from "socket.io";
import { createServer } from "http";
import * as crypto from "crypto";

// Load .env file before importing db
dotenv.config();

import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "./db/db";
import {
  NewRoom,
  NewUser,
  NewUserRoom,
  Room,
  User,
  rooms,
  userRooms,
  users,
} from "./db/schema";
import { eq } from "drizzle-orm";

const app: Express = express();
const server = createServer(app);
const port = process.env.PORT;

interface ServerToClientEvents {
  hello: (str: string) => void;
}

interface ClientToServerEvents {
  createUser: (data: { nickname: string }) => void;
  createRoom: (data: { host: User }) => void;
  joinRoom: (data: { user: User; room: Room }) => void;
}

const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("[CONNECTION]");

  socket.emit("hello", "world");

  socket.on("createUser", async (data) => {
    const newUser: NewUser = {
      nickname: data.nickname,
    };
    const insertedUsers = await db.insert(users).values(newUser).returning();
    console.log("[CREATE USER]:", insertedUsers);
  });

  socket.on("createRoom", async (data) => {
    let validRoomCode = false;

    let roomCode = crypto.randomBytes(4).toString("hex");

    while (!validRoomCode) {
      const doesRoomCodeExist = await db
        .select()
        .from(rooms)
        .where(eq(rooms.code, roomCode));

      if (!doesRoomCodeExist) {
        validRoomCode = true;
        break;
      }

      roomCode = crypto.randomBytes(4).toString("hex");
    }

    const newRoom: NewRoom = {
      hostId: data.host.id,
      code: roomCode,
    };
    const createRoom = await db.insert(rooms).values(newRoom).returning();
    console.log("[CREATE ROOM]:", createRoom);
  });

  socket.on("joinRoom", async (data) => {
    const newUserRoomRelationship: NewUserRoom = {
      userId: data.user.id,
      roomCode: data.room.code,
    };
    const addUserToRoom = await db
      .insert(userRooms)
      .values(newUserRoomRelationship)
      .returning();
    console.log("[ADD USER TO ROOM]:", addUserToRoom);
  });
});

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});
app.get("/ping", (req: Request, res: Response) => {
  res.status(200).send("pong");
});

server.listen(port, async () => {
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log(`listening on *:${port}`);
});
