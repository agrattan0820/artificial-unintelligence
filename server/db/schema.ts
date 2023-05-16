import { InferModel } from "drizzle-orm";
import { integer, pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  nickname: text("nickname").notNull(),
});

export const rooms = pgTable("rooms", {
  code: text("code").primaryKey(),
  hostId: integer("host_id").references(() => users.id),
});

export const userRooms = pgTable("user_rooms", {
  userId: integer("user_id").references(() => users.id),
  roomCode: text("room_code").references(() => rooms.code),
});

export type User = InferModel<typeof users>;
export type NewUser = InferModel<typeof users, "insert">;

export type Room = InferModel<typeof rooms>;
export type NewRoom = InferModel<typeof rooms, "insert">;

export type UserRoom = InferModel<typeof userRooms>;
export type NewUserRoom = InferModel<typeof userRooms, "insert">;
