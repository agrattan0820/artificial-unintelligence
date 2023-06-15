import { InferModel } from "drizzle-orm";
import {
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  nickname: text("nickname").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const rooms = pgTable("rooms", {
  code: text("code").primaryKey(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userRooms = pgTable(
  "user_rooms",
  {
    userId: integer("user_id").references(() => users.id),
    roomCode: text("room_code").references(() => rooms.code),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    cpk: primaryKey(table.userId, table.roomCode),
  })
);

export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  roomCode: text("room_code").references(() => rooms.code),
  firstQuestionId: integer("first_question_id").references(() => questions.id),
  secondQuestionId: integer("second_question_id").references(
    () => questions.id
  ),
  thirdQuestionId: integer("third_question_id").references(() => questions.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

export const generations = pgTable("generations", {
  id: serial("id").primaryKey(),
  gameId: integer("game_id").notNull(),
  text: text("text").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const votes = pgTable("votes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type User = InferModel<typeof users>;
export type NewUser = InferModel<typeof users, "insert">;

export type Room = InferModel<typeof rooms>;
export type NewRoom = InferModel<typeof rooms, "insert">;
export type RoomInfo = {
  code: string;
  createdAt: Date;
  players: User[];
};

export type UserRoom = InferModel<typeof userRooms>;
export type NewUserRoom = InferModel<typeof userRooms, "insert">;

export type Question = InferModel<typeof questions>;
export type NewQuestion = InferModel<typeof questions, "insert">;

export type Game = InferModel<typeof games>;
export type NewGame = InferModel<typeof games, "insert">;

export type Generation = InferModel<typeof generations>;
export type NewGeneration = InferModel<typeof generations, "insert">;

export type Vote = InferModel<typeof votes>;
export type NewVote = InferModel<typeof votes, "insert">;
