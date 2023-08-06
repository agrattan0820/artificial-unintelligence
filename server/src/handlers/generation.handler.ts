import { Server, Socket } from "socket.io";

import { ClientToServerEvents, ServerToClientEvents } from "../types";
import { handleSocketError } from "../utils";
import {
  createGeneration,
  getGameRoundGenerations,
  getSubmittedPlayers,
} from "../services/generation.service";
import { getGameInfo } from "../services/game.service";

export function generationSocketHandlers(
  io: Server<ClientToServerEvents, ServerToClientEvents>,
  socket: Socket<ClientToServerEvents, ServerToClientEvents>
) {
  socket.on("generationSubmitted", async (data) => {
    try {
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
      if (error instanceof Error)
        handleSocketError(error, socket, socket.handshake.auth.roomCode);
    }
  });
}
