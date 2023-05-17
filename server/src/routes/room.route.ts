import { Socket } from "socket.io";
import express, { Express, Request, Response } from "express";
import { createRoom, getRoomInfo, joinRoom } from "../services/room.service";
import { ClientToServerEvents, ServerToClientEvents } from "../../server";
import {
  acceptRoomInviteController,
  joinRoomController,
} from "../controllers/room.controller";

export function roomRoutes(
  app: Express,
  socket: Socket<ClientToServerEvents, ServerToClientEvents>
) {
  socket.on("joinRoom", async (data, callback) => {
    try {
      const addUserToRoom = await joinRoom(data);
      console.log("[ADD USER TO ROOM]:", addUserToRoom);
      socket.join(data.room.code);
      const roomInfo = await getRoomInfo({ roomCode: data.room.code });
      socket
        .to(data.room.code)
        .emit("message", `${data.user.nickname} is joining the room!`);

      if (roomInfo) {
        callback(roomInfo);
      }
    } catch (error) {
      socket.emit("error", "The room the user tried to join does not exist");
    }
  });

  app.get("/room/invite/:code", acceptRoomInviteController);
}
