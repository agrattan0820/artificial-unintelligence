import { Server, Socket } from "socket.io";

import {
  createGame,
  addUsersToGame,
  updateGame,
} from "../services/game.service";
import { assignQuestionsToPlayers } from "../services/question.service";
import { getRoom } from "../services/room.service";
import { ClientToServerEvents, ServerToClientEvents } from "../types";
import { handleSocketError } from "../utils";
import { redis } from "../redis";

export function gameSocketHandlers(
  io: Server<ClientToServerEvents, ServerToClientEvents>,
  socket: Socket<ClientToServerEvents, ServerToClientEvents>
) {
  socket.on("initiateGame", async (code) => {
    try {
      const newGame = await createGame({ code });

      await redis.set(
        `GAME_${newGame.id}`,
        JSON.stringify({
          state: newGame.state,
          round: newGame.round,
        })
      );

      await redis.expire(`GAME_${newGame.id}`, 3600); // expire in 1 hour

      const roomInfo = await getRoom({ code });

      if (!roomInfo?.players) {
        throw new Error(
          "The room's players were not defined when initiating the game"
        );
      }

      await addUsersToGame({
        gameId: newGame.id,
        players: roomInfo?.players,
      });

      await assignQuestionsToPlayers({
        gameId: newGame.id,
        players: roomInfo?.players,
      });

      socket.emit("startGame", newGame.id); // `socket.in` which is supposed to send to members including the sender is not working as expected, using two emits as a workaround
      socket.to(code).emit("startGame", newGame.id);
    } catch (error) {
      if (error instanceof Error) handleSocketError(error, socket, code);
    }
  });

  socket.on("initiatePlayAnotherGame", async (code) => {
    try {
      const newGame = await createGame({ code });

      console.log("[PLAY ANOTHER GAME]", newGame);

      await redis.set(
        `GAME_${newGame.id}`,
        JSON.stringify({
          state: newGame.state,
          round: newGame.round,
        })
      );

      await redis.expire(`GAME_${newGame.id}`, 3600); // expire in 1 hour

      const roomInfo = await getRoom({ code });

      if (!roomInfo?.players) {
        throw new Error(
          "The room's players were not defined when initiating the game"
        );
      }

      await addUsersToGame({
        gameId: newGame.id,
        players: roomInfo?.players,
      });

      await assignQuestionsToPlayers({
        gameId: newGame.id,
        players: roomInfo?.players,
      });

      socket.emit("playAnotherGame", newGame.id);
      socket.to(code).emit("playAnotherGame", newGame.id);
    } catch (error) {
      if (error instanceof Error) handleSocketError(error, socket, code);
    }
  });

  socket.on("clientEvent", async ({ state, gameId, round, completedAt }) => {
    try {
      let gameStateValue: string | null = null;

      const cacheValue = await redis.get(`GAME_${gameId}`);

      if (cacheValue) {
        const parsedGameState: { state: string; round: number } =
          JSON.parse(cacheValue);

        if (parsedGameState.state !== "START_GAME") {
          gameStateValue = JSON.parse(parsedGameState.state).value;
        } else {
          gameStateValue = parsedGameState.state;
        }
      }

      const clientStateValue =
        state !== "START_GAME" ? JSON.parse(state).value : state;

      if (gameStateValue !== clientStateValue) {
        await updateGame({
          state,
          gameId,
          round,
          completedAt: completedAt ? new Date(completedAt) : undefined,
        });

        if (completedAt && cacheValue) {
          await redis.del(`GAME_${gameId}`);
        } else {
          await redis.set(
            `GAME_${gameId}`,
            JSON.stringify({
              state,
              round,
            })
          );

          await redis.expire(`GAME_${gameId}`, 3600); // expire in 1 hour
        }
      }
    } catch (error) {
      if (error instanceof Error)
        handleSocketError(error, socket, socket.handshake.auth.roomCode);
    }
  });
}
