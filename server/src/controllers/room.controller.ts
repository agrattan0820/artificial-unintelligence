import express, { Express, Request, Response } from "express";
import { getRoom, joinRoom } from "../services/room.service";
import { ClientToServerEvents } from "../../server";

export const getRoomController = async (
  req: Request<{ code: string }>,
  res: Response
) => {
  const code = req.params.code;

  const roomInfo = await getRoom({ roomCode: code });

  if (!roomInfo) {
    res.status(404).send(`Room with room code of ${code} was not found`);
  }

  res.status(200).send(roomInfo);
};

export const joinRoomController: ClientToServerEvents["joinRoom"] = async (
  data,
  callback
) => {
  const addUserToRoom = await joinRoom(data);
  console.log("[ADD USER TO ROOM]:", addUserToRoom);
};
