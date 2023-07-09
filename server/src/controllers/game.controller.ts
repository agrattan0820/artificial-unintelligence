import type { NextFunction, Request, Response } from "express";
import { getLatestGameInfoByRoomCode } from "../services/game.service";

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
