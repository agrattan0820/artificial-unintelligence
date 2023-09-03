"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersToGames = exports.votes = exports.generations = exports.questionsToGames = exports.games = exports.questions = exports.usersToRooms = exports.rooms = exports.users = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    nickname: (0, pg_core_1.text)("nickname").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.rooms = (0, pg_core_1.pgTable)("rooms", {
    code: (0, pg_core_1.text)("code").primaryKey(),
    hostId: (0, pg_core_1.integer)("host_id").references(() => exports.users.id),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.usersToRooms = (0, pg_core_1.pgTable)("users_to_rooms", {
    userId: (0, pg_core_1.integer)("user_id")
        .references(() => exports.users.id)
        .notNull(),
    roomCode: (0, pg_core_1.text)("room_code")
        .references(() => exports.rooms.code)
        .notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
}, (table) => ({
    cpk: (0, pg_core_1.primaryKey)(table.userId, table.roomCode),
}));
exports.questions = (0, pg_core_1.pgTable)("questions", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    text: (0, pg_core_1.text)("text").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.games = (0, pg_core_1.pgTable)("games", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    roomCode: (0, pg_core_1.text)("room_code")
        .references(() => exports.rooms.code)
        .notNull(),
    state: (0, pg_core_1.text)("state").notNull(),
    round: (0, pg_core_1.integer)("round").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    completedAt: (0, pg_core_1.timestamp)("completed_at"),
});
exports.questionsToGames = (0, pg_core_1.pgTable)("questions_to_games", {
    questionId: (0, pg_core_1.integer)("question_id")
        .references(() => exports.questions.id)
        .notNull(),
    gameId: (0, pg_core_1.integer)("game_id")
        .references(() => exports.games.id)
        .notNull(),
    round: (0, pg_core_1.integer)("round").notNull(),
    player1: (0, pg_core_1.integer)("player_1")
        .references(() => exports.users.id)
        .notNull(),
    player2: (0, pg_core_1.integer)("player_2")
        .references(() => exports.users.id)
        .notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
}, (table) => ({
    cpk: (0, pg_core_1.primaryKey)(table.gameId, table.questionId),
}));
exports.generations = (0, pg_core_1.pgTable)("generations", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    userId: (0, pg_core_1.integer)("user_id")
        .references(() => exports.users.id)
        .notNull(),
    gameId: (0, pg_core_1.integer)("game_id")
        .references(() => exports.games.id)
        .notNull(),
    questionId: (0, pg_core_1.integer)("question_id")
        .references(() => exports.questions.id)
        .notNull(),
    text: (0, pg_core_1.text)("text").notNull(),
    imageUrl: (0, pg_core_1.text)("image_url").notNull(),
    selected: (0, pg_core_1.boolean)("selected").default(false).notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.votes = (0, pg_core_1.pgTable)("votes", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    userId: (0, pg_core_1.integer)("user_id")
        .references(() => exports.users.id)
        .notNull(),
    generationId: (0, pg_core_1.integer)("generation_id")
        .references(() => exports.generations.id)
        .notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.usersToGames = (0, pg_core_1.pgTable)("users_to_games", {
    userId: (0, pg_core_1.integer)("user_id")
        .references(() => exports.users.id)
        .notNull(),
    gameId: (0, pg_core_1.integer)("game_id")
        .references(() => exports.games.id)
        .notNull(),
    points: (0, pg_core_1.integer)("points").default(0).notNull(),
}, (table) => ({
    cpk: (0, pg_core_1.primaryKey)(table.userId, table.gameId),
}));
