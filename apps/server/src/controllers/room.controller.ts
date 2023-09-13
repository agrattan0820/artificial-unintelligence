import type { NextFunction, Request, Response } from "express";
import { getRoom, joinRoom } from "../services/room.service";
import { updateUserNickname } from "../services/user.service";

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
  req: Request<{}, {}, { userId: string; nickname: string; code: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const { userId, nickname, code } = req.body;

    const checkRoomExists = await getRoom({ code });

    if (!checkRoomExists) {
      res
        .status(404)
        .send({ error: `Room with the code ${code} was not found` });
      return;
    }

    if (checkRoomExists.players.length >= 8) {
      res.status(400).send(`Room with the code ${code} is full`);
      return;
    }

    const updatedUser = await updateUserNickname({
      userId,
      nickname,
    });

    if (!checkRoomExists.players.some((player) => player.id === userId)) {
      const addUserToRoom = await joinRoom({
        userId: userId,
        code,
      });
      console.log("[ADD USER TO ROOM]:", addUserToRoom);
    }

    res.status(200).send({ user: updatedUser });
  } catch (error) {
    next(error);
  }
}
