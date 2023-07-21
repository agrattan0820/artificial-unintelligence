import type { NextFunction, Request, Response } from "express";
import {
  getQuestionById,
  getUserQuestionsForRound,
} from "../services/question.service";

export async function getQuestionByIdController(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number.parseInt(req.params.id);

    const question = await getQuestionById({ id });

    if (!question) {
      res
        .status(404)
        .send({ error: `Question with the id of ${id} was not found` });
    }

    res.status(200).send(question);
  } catch (error) {
    next(error);
  }
}

export async function getQuestionsByUserGameRoundController(
  req: Request<{ userId: string; gameId: string; round: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = Number.parseInt(req.params.userId);
    const gameId = Number.parseInt(req.params.gameId);
    const round = Number.parseInt(req.params.round);

    const questions = await getUserQuestionsForRound({ userId, gameId, round });

    if (questions.length === 0) {
      res.status(404).send({
        error: `Questions for the user: ${userId} could not be found for this game: ${gameId}, and round: ${round}`,
      });
    }

    res.status(200).send(questions);
  } catch (error) {
    next(error);
  }
}
