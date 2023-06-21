import type { NextFunction, Request, Response } from "express";
import { getLatestGameInfoByRoomCode } from "../services/game.service";
import { getQuestionById } from "../services/question.service";

export const getQuestionByIdController = async (
  req: Request<{ id: number }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;

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
};
