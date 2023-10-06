import type { NextFunction, Request, Response } from "express";

import { createRoom, joinRoom } from "../services/room.service";
import { deleteUser, updateUserNickname } from "../services/user.service";

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

export async function deleteUserController(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    console.log("HEREEEE????");

    const deletedUser = await deleteUser({ userId: id });
    console.log("DELETED USER", deletedUser);

    res.status(200).json({ user: deletedUser });
  } catch (error) {
    next(error);
  }
}
