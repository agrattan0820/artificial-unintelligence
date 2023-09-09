import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import type { AdapterAccount } from "@auth/core/adapters";

export const users = pgTable("users", {
  id: text("id").notNull().primaryKey(),
  nickname: text("nickname"),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const accounts = pgTable(
  "accounts",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
  })
);

export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  })
);

export const rooms = pgTable("rooms", {
  code: text("code").primaryKey(),
  hostId: text("host_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const usersToRooms = pgTable(
  "users_to_rooms",
  {
    userId: text("user_id")
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
    player1: text("player_1")
      .references(() => users.id)
      .notNull(),
    player2: text("player_2")
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
  userId: text("user_id")
    .references(() => users.id)
    .notNull(),
  gameId: integer("game_id")
    .references(() => games.id)
    .notNull(),
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
  userId: text("user_id")
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
    userId: text("user_id")
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

export type User = typeof users.$inferInsert;
export type NewUser = typeof users.$inferInsert;

export type Room = typeof rooms.$inferSelect;
export type NewRoom = typeof rooms.$inferInsert;
export type RoomInfo = {
  hostId: string | null;
  code: string;
  createdAt: Date;
  players: User[];
};

export type UserRoom = typeof usersToRooms.$inferSelect;
export type NewUserRoom = typeof usersToRooms.$inferInsert;

export type Question = typeof questions.$inferSelect;
export type NewQuestion = typeof questions.$inferInsert;

export type Game = typeof games.$inferSelect;
export type NewGame = typeof games.$inferInsert;

export type QuestionToGame = typeof questionsToGames.$inferSelect;
export type NewQuestionToGame = typeof questionsToGames.$inferInsert;

export type Generation = typeof generations.$inferSelect;
export type NewGeneration = typeof generations.$inferInsert;

export type Vote = typeof votes.$inferSelect;
export type NewVote = typeof votes.$inferInsert;

export type UserGame = typeof usersToGames.$inferSelect;
export type NewUserGame = typeof games.$inferInsert;
