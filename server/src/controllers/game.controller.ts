import type { NextFunction, Request, Response } from "express";
import {
  getLeaderboardById,
  getLatestGameInfoByRoomCode,
} from "../services/game.service";

export async function getLatestGameByRoomCodeController(
  req: Request<{ code: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const code = req.params.code;

    const gameInfo = await getLatestGameInfoByRoomCode({ code });

    if (!gameInfo) {
      res
        .status(404)
        .send({ error: `Game with room code of ${code} was not found` });
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

    console.log("TYPEOF ID", typeof id);

    const gameInfo = await getLeaderboardById({ gameId: id });

    if (!gameInfo) {
      res.status(404).send({ error: `Game with an id of ${id} was not found` });
    }

    res.status(200).send(gameInfo);
  } catch (error) {
    next(error);
  }
}
