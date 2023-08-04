import type { NextFunction, Request, Response } from "express";
import {
  getGameRoundGenerations,
  mapGenerationsByQuestion,
} from "../services/generation.service";

export async function getFaceOffsController(
  req: Request<{ gameId: string; round: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const gameId = Number.parseInt(req.params.gameId);
    const round = Number.parseInt(req.params.round);

    const gameRoundGenerations = await getGameRoundGenerations({
      gameId,
      round,
    });

    if (!gameRoundGenerations) {
      res.status(404).send({
        error: `Generations with gameId of ${gameId} and round of ${round} were not found`,
      });
      return;
    }

    const faceOffs = mapGenerationsByQuestion({
      gameRoundGenerations,
    });

    res.status(200).send(faceOffs);
  } catch (error) {
    next(error);
  }
}
