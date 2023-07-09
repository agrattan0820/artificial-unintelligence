import type { NextFunction, Request, Response } from "express";
import { getGameRoundGenerations } from "../services/generation.service";

export async function getGameRoundGenerationsController(
  req: Request<{ gameId: number; round: number }>,
  res: Response,
  next: NextFunction
) {
  try {
    const params = req.params;

    const generations = await getGameRoundGenerations(params);

    if (!generations) {
      res.status(404).send({
        error: `Generations with gameId of ${params.gameId} and round of ${params.round} were not found`,
      });
    }

    res.status(200).send(generations);
  } catch (error) {
    next(error);
  }
}
