import type { NextFunction, Request, Response } from "express";
import { getRoom, joinRoom } from "../services/room.service";
import { createUser } from "../services/user.service";

export async function getRoomController(
  req: Request<{ code: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const code = req.params.code;

    const roomInfo = await getRoom({ code });

    if (!roomInfo) {
      res.status(404).send({ error: `Room with code ${code} was not found` });
      return;
    }

    res.status(200).send(roomInfo);
  } catch (error) {
    next(error);
  }
}

export async function joinRoomController(
  req: Request<{}, {}, { nickname: string; code: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const { nickname, code } = req.body;

    const checkRoomExists = await getRoom({ code });

    if (!checkRoomExists) {
      res.status(404).send(`Room with the code ${code} was not found`);
      return;
    }

    const createdUser = await createUser({ nickname });
    const addUserToRoom = await joinRoom({
      userId: createdUser.id,
      code,
    });

    console.log("[ADD USER TO ROOM]:", addUserToRoom);

    res.status(200).send({ user: createdUser });
  } catch (error) {
    next(error);
  }
}
