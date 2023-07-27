import type { NextFunction, Request, Response } from "express";
import { getGameRoundGenerations } from "../services/generation.service";

export async function getGameRoundGenerationsController(
  req: Request<{ gameId: string; round: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const gameId = Number.parseInt(req.params.gameId);
    const round = Number.parseInt(req.params.round);

    const generations = await getGameRoundGenerations({ gameId, round });

    if (!generations) {
      res.status(404).send({
        error: `Generations with gameId of ${gameId} and round of ${round} were not found`,
      });
      return;
    }

    res.status(200).send(generations);
  } catch (error) {
    next(error);
  }
}
