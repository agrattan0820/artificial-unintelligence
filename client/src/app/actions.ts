"use server";

import * as crypto from "crypto";
import supabase from "@ai/utils/supabase";
import { Room, User } from "@ai/types/api.type";

export const createHost = async (nickname: string) => {
  const { data: host } = await supabase
    .from("users")
    .insert({
      nickname: nickname,
    })
    .select()
    .limit(1)
    .single();

  const code = crypto.randomBytes(4).toString("hex");
  const { data: room } = await supabase
    .from("rooms")
    .insert({
      host_id: host?.id,
      code,
    })
    .select()
    .limit(1)
    .single();

  if (!host || !room) {
    throw new Error("Unable to create host");
  }

  return {
    host,
    room,
  };
};

export const joinRoom = async (nickname: string, room: Room) => {
  const { data: user, error: userError } = await supabase
    .from("users")
    .insert({
      nickname: nickname,
    })
    .select()
    .limit(1)
    .single();

  if (!user) {
    throw new Error(
      `Unable to create user to join room: ${userError?.message}`
    );
  }

  const { data: userRoom, error: userRoomError } = await supabase
    .from("user_rooms")
    .insert({
      user_id: user.id,
      room_code: room.code,
    })
    .select()
    .limit(1)
    .single();

  if (!userRoom) {
    throw new Error(`Unable to join room: ${userRoomError?.message}`);
  }

  return {
    user,
    room,
    userRoom,
  };
};
