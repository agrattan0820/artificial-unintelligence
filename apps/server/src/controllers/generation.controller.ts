import type { NextFunction, Request, Response } from "express";
import {
  createGeneration,
  getFaceOffGenerations,
  getGenerationCount,
  getReplicateAIImages,
  mapGenerationsByQuestion,
} from "../services/generation.service";

export async function createGenerationsController(
  req: Request<
    Record<string, never>,
    Record<string, never>,
    {
      userId: string;
      gameId: string;
      questionId: string;
      images: { text: string; imageUrl: string }[];
    }
  >,
  res: Response,
  next: NextFunction
) {
  try {
    const { userId, gameId, questionId, images } = req.body;

    const gameIdToNum = Number.parseInt(gameId);
    const questionIdToNum = Number.parseInt(questionId);

    const generationCount = await getGenerationCount({
      gameId: gameIdToNum,
      userId,
      questionId: questionIdToNum,
    });

    if (generationCount >= 8) {
      throw new Error("Exceeded generation count for question.");
    }

    const generations = await Promise.all(
      images.map((image) =>
        createGeneration({
          userId,
          gameId: gameIdToNum,
          questionId: questionIdToNum,
          text: image.text,
          imageUrl: image.imageUrl,
        })
      )
    );

    res.status(200).send(generations);
  } catch (error) {
    next(error);
  }
}

export async function replicateAIController(
  req: Request<
    Record<string, never>,
    Record<string, never>,
    {
      prompt: string;
    }
  >,
  res: Response,
  next: NextFunction
) {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      res.status(400).send({ error: "Please enter a valid prompt" });
      return;
    }

    const replicateAIImages = await getReplicateAIImages({ prompt });

    if (!replicateAIImages) {
      throw new Error("Failed to generate images");
    }

    res.status(200).send({ result: replicateAIImages });
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
