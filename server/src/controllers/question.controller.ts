import type { NextFunction, Request, Response } from "express";
import {
  getQuestionById,
  getUserQuestionsForRound,
} from "../services/question.service";

export async function getQuestionByIdController(
  req: Request<{ id: number }>,
  res: Response,
  next: NextFunction
) {
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
}

export async function getQuestionsByUserGameRoundController(
  req: Request<{ userId: number; gameId: number; round: number }>,
  res: Response,
  next: NextFunction
) {
  try {
    const params = req.params;

    const questions = await getUserQuestionsForRound(params);

    if (questions.length === 0) {
      res.status(404).send({
        error: `Questions for the user: ${params.userId} could not be found for this game: ${params.gameId}, and round: ${params.round}`,
      });
    }

    res.status(200).send(questions);
  } catch (error) {
    next(error);
  }
}

// export const createQuestionController = async (
//   req: Request<{}, {}, { text: string }>,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const body = req.body;

//     const question = await createQuestion(body);

//     res.status(200).send(question);
//   } catch (error) {
//     next(error);
//   }
// };
