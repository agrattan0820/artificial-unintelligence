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

export function gameSocketHandlers(
  io: Server<ClientToServerEvents, ServerToClientEvents>,
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
  gameStateMap: Map<number, { state: string; round: number }>
) {
  socket.on("initiateGame", async (code) => {
    try {
      const newGame = await createGame({ code });

      gameStateMap.set(newGame.id, {
        state: newGame.state,
        round: newGame.round,
      });

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

      socket.emit("startGame"); // `socket.in` which is supposed to send to members including the sender is not working as expected, using two emits as a workaround
      socket.to(code).emit("startGame");
    } catch (error) {
      if (error instanceof Error) handleSocketError(error, socket, code);
    }
  });

  socket.on("initiatePlayAnotherGame", async (code) => {
    try {
      const newGame = await createGame({ code });

      console.log("[PLAY ANOTHER GAME]", newGame);

      gameStateMap.set(newGame.id, {
        state: newGame.state,
        round: newGame.round,
      });

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

      socket.emit("playAnotherGame");
      socket.to(code).emit("playAnotherGame");
    } catch (error) {
      if (error instanceof Error) handleSocketError(error, socket);
    }
  });

  socket.on("clientEvent", async ({ state, gameId, round, completedAt }) => {
    try {
      const mapValue = gameStateMap.get(gameId);

      if (mapValue) {
        const gameStateValue =
          mapValue.state !== "START_GAME"
            ? JSON.parse(mapValue.state).value
            : mapValue.state;
        const clientStateValue =
          state !== "START_GAME" ? JSON.parse(state).value : state;

        if (gameStateValue !== clientStateValue) {
          gameStateMap.set(gameId, { state, round });
          await updateGame({
            state,
            gameId,
            round,
            completedAt: completedAt ? new Date(completedAt) : undefined,
          });
        }
      }
    } catch (error) {
      if (error instanceof Error) handleSocketError(error, socket);
    }
  });
}
