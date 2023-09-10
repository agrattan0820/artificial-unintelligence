import type { NextFunction, Request, Response } from "express";
import {
  getGameInfo,
  getGamePageInfo,
  getLeaderboardById,
} from "../services/game.service";

export async function getGameInfoController(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const gameId = Number(req.params.id);

    const initialGameInfo = await getGameInfo({ gameId });

    if (!initialGameInfo) {
      res
        .status(404)
        .send({ error: `Game with the id of ${gameId} was not found` });
      return;
    }

    const gamePageInfo = await getGamePageInfo({
      game: initialGameInfo?.game,
      players: initialGameInfo?.players,
    });

    res.status(200).send(gamePageInfo);
  } catch (error) {
    next(error);
  }
}

export async function getLeaderboardByIdController(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number.parseInt(req.params.id);

    const leaderboard = await getLeaderboardById({ gameId: id });

    if (!leaderboard) {
      res.status(404).send({ error: `Game with an id of ${id} was not found` });
      return;
    }

    res.status(200).send(leaderboard);
  } catch (error) {
    next(error);
  }
}
