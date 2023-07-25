import type { NextFunction, Request, Response } from "express";

import { createRoom, joinRoom } from "../services/room.service";
import { createUser } from "../services/user.service";

export async function createHostController(
  req: Request<{}, {}, { nickname: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const body = req.body;

    const newUser = await createUser(body);

    const newRoom = await createRoom({ hostId: newUser.id });

    await joinRoom({
      userId: newUser.id,
      code: newRoom.code,
    });

    res.status(200).json({ host: newUser, room: newRoom });
  } catch (error) {
    next(error);
  }
}

export async function createUserController(
  req: Request<{}, {}, { nickname: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const body = req.body;

    const newUser = await createUser(body);
    console.log("[CREATE USER]:", newUser);

    res.status(200).json({ user: newUser });
  } catch (error) {
    next(error);
  }
}
