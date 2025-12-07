import type { Server, Socket } from "socket.io";

import type { ClientToServerEvents, ServerToClientEvents } from "../types";
import { handleSocketError } from "../utils";
import { getGameInfo } from "../services/game.service";
import {
  getFaceOffGenerations,
  filterFaceOffGenerationsByQuestionId,
} from "../services/generation.service";
import {
  createVote,
  getVotesByQuestionId,
  createVoteMap,
  saveVotePoints,
} from "../services/vote.service";

export function voteSocketHandlers(
  io: Server<ClientToServerEvents, ServerToClientEvents>,
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
) {
  socket.on("voteSubmitted", async (data) => {
    try {
      const gameInfo = await getGameInfo({ gameId: data.gameId });

      if (!gameInfo) {
        socket.emit("error", `Unable to find game with gameId`);
        return;
      }

      await createVote({
        userId: data.userId,
        generationId: data.generationId,
      });

      const questionVotes = await getVotesByQuestionId({
        questionId: data.questionId,
        gameId: data.gameId,
      });

      socket.emit("votedPlayers", questionVotes);
      socket.to(gameInfo.game.roomCode).emit("votedPlayers", questionVotes);

      const totalNeeded = gameInfo.players.length - 2; // assuming 3+ players
      const currentAmount = questionVotes.length;

      if (currentAmount >= totalNeeded) {
        const faceOffGenerations = await getFaceOffGenerations({
          gameId: data.gameId,
          round: gameInfo.game.round,
        });

        const filteredGenerations = filterFaceOffGenerationsByQuestionId({
          questionId: data.questionId,
          faceOffGenerations,
        });

        const voteMap = createVoteMap({
          generations: filteredGenerations,
          userVotes: questionVotes,
        });

        await saveVotePoints({
          voteMap,
          totalVotes: questionVotes.length,
          gameId: data.gameId,
        });

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
