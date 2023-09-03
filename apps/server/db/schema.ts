import { InferModel } from "drizzle-orm";
import {
  boolean,
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
  hostId: integer("host_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const usersToRooms = pgTable(
  "users_to_rooms",
  {
    userId: integer("user_id")
      .references(() => users.id)
      .notNull(),
    roomCode: text("room_code")
      .references(() => rooms.code)
      .notNull(),
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
  roomCode: text("room_code")
    .references(() => rooms.code)
    .notNull(),
  state: text("state").notNull(),
  round: integer("round").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

export const questionsToGames = pgTable(
  "questions_to_games",
  {
    questionId: integer("question_id")
      .references(() => questions.id)
      .notNull(),
    gameId: integer("game_id")
      .references(() => games.id)
      .notNull(),
    round: integer("round").notNull(),
    player1: integer("player_1")
      .references(() => users.id)
      .notNull(),
    player2: integer("player_2")
      .references(() => users.id)
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    cpk: primaryKey(table.gameId, table.questionId),
  })
);

export const generations = pgTable("generations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  gameId: integer("game_id").references(() => games.id), // TODO make gameId not null
  questionId: integer("question_id")
    .references(() => questions.id)
    .notNull(),
  text: text("text").notNull(),
  imageUrl: text("image_url").notNull(),
  selected: boolean("selected").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const votes = pgTable("votes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  generationId: integer("generation_id")
    .references(() => generations.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const usersToGames = pgTable(
  "users_to_games",
  {
    userId: integer("user_id")
      .references(() => users.id)
      .notNull(),
    gameId: integer("game_id")
      .references(() => games.id)
      .notNull(),
    points: integer("points").default(0).notNull(),
  },
  (table) => ({
    cpk: primaryKey(table.userId, table.gameId),
  })
);

export type User = InferModel<typeof users>;
export type NewUser = InferModel<typeof users, "insert">;

export type Room = InferModel<typeof rooms>;
export type NewRoom = InferModel<typeof rooms, "insert">;
export type RoomInfo = {
  hostId: number | null;
  code: string;
  createdAt: Date;
  players: User[];
};

export type UserRoom = InferModel<typeof usersToRooms>;
export type NewUserRoom = InferModel<typeof usersToRooms, "insert">;

export type Question = InferModel<typeof questions>;
export type NewQuestion = InferModel<typeof questions, "insert">;

export type Game = InferModel<typeof games>;
export type NewGame = InferModel<typeof games, "insert">;

export type QuestionToGame = InferModel<typeof questionsToGames>;
export type NewQuestionToGame = InferModel<typeof questionsToGames, "insert">;

export type Generation = InferModel<typeof generations>;
export type NewGeneration = InferModel<typeof generations, "insert">;

export type Vote = InferModel<typeof votes>;
export type NewVote = InferModel<typeof votes, "insert">;
