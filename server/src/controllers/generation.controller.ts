import type { NextFunction, Request, Response } from "express";
import {
  createGeneration,
  getFaceOffGenerations,
  getGenerationCount,
  getUserGenerationInfo,
  mapGenerationsByQuestion,
} from "../services/generation.service";

export async function createGenerationsController(
  req: Request<
    {},
    {},
    {
      userId: number;
      gameId: number;
      questionId: number;
      images: { text: string; imageUrl: string }[];
    }
  >,
  res: Response,
  next: NextFunction
) {
  try {
    const { userId, gameId, questionId, images } = req.body;

    const generationCount = await getGenerationCount({
      gameId,
      userId,
      questionId,
    });

    if (generationCount >= 6) {
      throw new Error("Exceeded generation count for question.");
    }

    const generations = await Promise.all(
      images.map((image) =>
        createGeneration({
          userId,
          gameId,
          questionId,
          text: image.text,
          imageUrl: image.imageUrl,
        })
      )
    );

    return generations;
  } catch (error) {
    next(error);
  }
}

export async function getFaceOffsController(
  req: Request<{ gameId: string; round: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const gameId = Number.parseInt(req.params.gameId);
    const round = Number.parseInt(req.params.round);

    const faceOffGenerations = await getFaceOffGenerations({
      gameId,
      round,
    });

    if (!faceOffGenerations) {
      res.status(404).send({
        error: `Generations with gameId of ${gameId} and round of ${round} were not found`,
      });
      return;
    }

    const faceOffs = mapGenerationsByQuestion({
      faceOffGenerations,
    });

    res.status(200).send(faceOffs);
  } catch (error) {
    next(error);
  }
}

export async function getUserGenerationInfoController(
  req: Request<{
    gameId: string;
    userId: string;
    round: string;
  }>,
  res: Response,
  next: NextFunction
) {
  try {
    const gameId = Number.parseInt(req.params.gameId);
    const userId = Number.parseInt(req.params.userId);
    const round = Number.parseInt(req.params.round);

    const generationInfo = await getUserGenerationInfo({
      gameId,
      userId,
      round,
    });

    if (!generationInfo) {
      res.status(404).send({
        error: `Generation info with gameId of ${gameId}, round of ${round}, and userId of ${userId} were not found`,
      });
      return;
    }

    res.status(200).send(generationInfo);
  } catch (error) {
    next(error);
  }
}
