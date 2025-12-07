import type { Server, Socket } from "socket.io";

import {
  checkRoomForUserAndAdd,
  findNextHost,
  getRoom,
  leaveRoom,
  updateRoomHost,
} from "../services/room.service";
import { handleSocketError } from "../utils";
import redis from "../redis";
import type { ClientToServerEvents, ServerToClientEvents } from "../types";

export async function checkIfExistingUser(
  io: Server<ClientToServerEvents, ServerToClientEvents>,
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
) {
  if (socket.handshake.auth.roomCode) {
    const roomCode: string = socket.handshake.auth.roomCode;
    socket.join(roomCode);

    if (socket.handshake.auth.userId) {
      const userId = socket.handshake.auth.userId;

      try {
        console.log(`[CHECKING IF ${userId} IS IN ROOM ${roomCode}]`);
        const updatedRoomInfo = await checkRoomForUserAndAdd({
          userId,
          roomCode,
        });
        if (updatedRoomInfo) {
          socket.emit("roomState", updatedRoomInfo);
          socket.to(roomCode).emit("roomState", updatedRoomInfo);
        }
      } catch (error) {
        if (error instanceof Error) handleSocketError(error, socket, roomCode);
      }
    }
  }
}

export async function connectionSocketHandlers(
  io: Server<ClientToServerEvents, ServerToClientEvents>,
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
) {
  socket.on("disconnecting", async () => {
    try {
      await Promise.all(
        [...socket.rooms].map(async (room) => {
          const userId = socket.handshake.auth.userId;

          await leaveRoom({
            userId,
            code: room,
          });
          const roomInfo = await getRoom({ code: room });

          if (!roomInfo) {
            socket.emit("error", `Unable to fully disconnect from room`);
            return;
          }

          if (roomInfo.hostId === userId) {
            const newHost = findNextHost({
              prevHostId: roomInfo.hostId,
              players: roomInfo.players,
            });
            if (!newHost) {
              console.log(`[NO OTHER PLAYERS REMAIN IN ${room}]`);

              const gameId = socket.handshake.auth.gameId
                ? Number(socket.handshake.auth.gameId)
                : null;

              if (gameId) {
                await redis.del(`GAME_${gameId}`);
              }

              return;
            }
            await updateRoomHost({ newHostId: newHost.id, roomCode: room });
          }

          socket.to(room).emit("roomState", roomInfo);
        }),
      );
    } catch (error) {
      if (error instanceof Error)
        handleSocketError(error, socket, socket.handshake.auth.roomCode);
    }
  });
}
