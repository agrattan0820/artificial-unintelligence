import { Server, Socket } from "socket.io";

import { ClientToServerEvents, ServerToClientEvents } from "../types";
import {
  findNextHost,
  getRoom,
  joinRoom,
  leaveRoom,
  updateRoomHost,
} from "../services/room.service";
import { handleSocketError } from "../utils";
import redis from "../redis";

export function roomSocketHandlers(
  io: Server<ClientToServerEvents, ServerToClientEvents>,
  socket: Socket<ClientToServerEvents, ServerToClientEvents>
) {
  socket.on("connectToRoom", async (data) => {
    const { userId, code } = data;
    if (userId && code) {
      try {
        let roomInfo = await getRoom({ code });

        if (!roomInfo) {
          socket.emit("message", `Unable to connect to room`);
          return;
        }

        const playerInRoom = roomInfo.players.some(
          (player) => player.id === userId
        );

        if (roomInfo.players.length >= 8 && !playerInRoom) {
          socket.emit("message", "Room is full, unable to join");
          return;
        }

        if (!playerInRoom) {
          await joinRoom({ userId: userId, code });
          roomInfo = await getRoom({ code });
        }

        if (!roomInfo) {
          throw new Error("Unable to get room info after join");
        }

        socket.join(code);
        socket.to(code).emit("roomState", roomInfo);
      } catch (error) {
        if (error instanceof Error) handleSocketError(error, socket, code);
      }
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

      // TODO: Make this find new host and game state map deletion reusuable
      if (roomInfo.hostId === userId) {
        const newHost = findNextHost({
          prevHostId: roomInfo.hostId,
          players: roomInfo.players,
        });
        if (!newHost) {
          console.log(`[NO OTHER PLAYERS REMAIN IN ${code}]`);

          const gameId = socket.handshake.auth.gameId
            ? Number(socket.handshake.auth.gameId)
            : null;
          if (gameId) {
            await redis.del(`GAME_${gameId}`);
          }

          return;
        }
        await updateRoomHost({
          newHostId: newHost.id,
          roomCode: code,
        });
      }

      socket.leave(code);
      socket.to(code).emit("roomState", roomInfo);
    } catch (error) {
      if (error instanceof Error) handleSocketError(error, socket, code);
    }
  });
}
