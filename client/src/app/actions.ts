"use server";

import * as crypto from "crypto";
import supabase from "@ai/utils/supabase";
import { Room, User } from "@ai/types/api.type";

export const createHost = async (nickname: string) => {
  const { data: host, error: hostError } = await supabase
    .from("users")
    .insert({
      nickname: nickname,
    })
    .select()
    .limit(1)
    .single();

  if (!host) {
    throw new Error(`Unable to create host: ${hostError.message}`);
  }

  const code = crypto.randomBytes(4).toString("hex");
  const { data: room, error: roomError } = await supabase
    .from("rooms")
    .insert({
      code,
    })
    .select()
    .limit(1)
    .single();

  if (!room) {
    throw new Error(`Unable to create room for host: ${roomError.message}`);
  }

  // TODO: initially don't make user_room relation until game starts
  // const { data: userRoom, error: userRoomError } = await supabase
  //   .from("user_rooms")
  //   .insert({
  //     user_id: host.id,
  //     room_code: room.code,
  //     host: true,
  //   })
  //   .select()
  //   .limit(1)
  //   .single();

  // if (!userRoom) {
  //   throw new Error(
  //     `Unable to create host and room relation: ${userRoomError.message}`
  //   );
  // }

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

export const getRoomInfo = async (code: string) => {
  const { data: room, error: roomError } = await supabase
    .from("rooms")
    .select(
      `
      code,
      created_at,
      players: users(*)
      `
    )
    .match({ code })
    .limit(1)
    .single();

  if (!room) {
    throw new Error(`Unable to get room info: ${roomError?.message}`);
  }

  return room;
};
