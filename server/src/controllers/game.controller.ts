import type { NextFunction, Request, Response } from "express";
import {
  getLeaderboardById,
  getPageGameInfoByRoomCode,
  getUserRegenerationCount,
  incrementUserRegenerationCount,
} from "../services/game.service";

export async function getPageGameInfoByRoomCodeController(
  req: Request<{ code: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const code = req.params.code;

    const gameInfo = await getPageGameInfoByRoomCode({ code });

    if (!gameInfo) {
      res
        .status(404)
        .send({ error: `Game with room code of ${code} was not found` });
      return;
    }

    res.status(200).send(gameInfo);
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

export async function getUserRegenerationCountController(
  req: Request<{ id: string; userId: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const gameId = Number.parseInt(req.params.id);
    const userId = Number.parseInt(req.params.userId);

    const regenerationCount = await getUserRegenerationCount({
      gameId,
      userId,
    });

    if (regenerationCount === undefined || regenerationCount === null) {
      res.status(404).send({
        error: `Regeneration Count with a game id of ${gameId} and a user id of ${userId} was not found`,
      });
      return;
    }

    res.status(200).send({ count: regenerationCount });
  } catch (error) {
    next(error);
  }
}

export async function incrementUserRegenerationCountController(
  req: Request<{ id: string; userId: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const gameId = Number.parseInt(req.params.id);
    const userId = Number.parseInt(req.params.userId);

    const regenerationCount = await incrementUserRegenerationCount({
      gameId,
      userId,
    });

    if (regenerationCount === undefined || regenerationCount === null) {
      res.status(404).send({
        error: `Regeneration Count with a game id of ${gameId} and a user id of ${userId} was not found`,
      });
      return;
    }

    res.status(200).send({ count: regenerationCount });
  } catch (error) {
    next(error);
  }
}
