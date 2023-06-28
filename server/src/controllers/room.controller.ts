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
      res
        .status(404)
        .send({ error: `Room with room code of ${code} was not found` });
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

    const createdUser = await createUser({ nickname });
    const addUserToRoom = await joinRoom({
      userId: createdUser.id,
      code,
    });
    // Unsure right now if it's necessary to return the room info
    // const roomInfo = await getRoom({ roomCode: room.code });

    console.log("[ADD USER TO ROOM]:", addUserToRoom);

    res.status(200).send({ user: createdUser });
  } catch (error) {
    next(error);
  }
}
