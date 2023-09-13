import type { NextFunction, Request, Response } from "express";

import { createRoom, joinRoom } from "../services/room.service";
import { updateUserNickname } from "../services/user.service";

export async function existingHostController(
  req: Request<{}, {}, { userId: string; nickname: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const { userId, nickname } = req.body;

    const newRoom = await createRoom({ hostId: userId });

    await updateUserNickname({
      userId,
      nickname,
    });

    await joinRoom({
      userId: userId,
      code: newRoom.code,
    });

    res.status(200).json({ room: newRoom });
  } catch (error) {
    next(error);
  }
}
