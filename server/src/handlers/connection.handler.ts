import { Server, Socket } from "socket.io";

import { ClientToServerEvents, ServerToClientEvents } from "../types";
import {
  checkRoomForUserAndAdd,
  findNextHost,
  getRoom,
  leaveRoom,
  updateRoomHost,
} from "../services/room.service";
import { handleSocketError } from "../utils";

export async function checkIfExistingUser(
  socket: Socket<ClientToServerEvents, ServerToClientEvents>
) {
  if (socket.handshake.auth.userId && socket.handshake.auth.roomCode) {
    const userId = Number(socket.handshake.auth.userId);
    const roomCode: string = socket.handshake.auth.roomCode;
    socket.join(roomCode);
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

export async function connectionSocketHandlers(
  io: Server<ClientToServerEvents, ServerToClientEvents>,
  socket: Socket<ClientToServerEvents, ServerToClientEvents>
) {
  socket.on("disconnecting", async () => {
    try {
      await Promise.all(
        [...socket.rooms].map(async (room) => {
          const userId = Number(socket.handshake.auth.userId);

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
              return;
            }
            await updateRoomHost({ newHostId: newHost.id, roomCode: room });
          }

          socket.to(room).emit("roomState", roomInfo);
        })
      );
    } catch (error) {
      if (error instanceof Error) handleSocketError(error, socket);
    }
  });
}
