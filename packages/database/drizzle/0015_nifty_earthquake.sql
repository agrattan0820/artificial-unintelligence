ALTER TABLE "questions" DROP CONSTRAINT "questions_game_id_games_id_fk";
--> statement-breakpoint
ALTER TABLE "questions" DROP CONSTRAINT "questions_player_1_users_id_fk";
--> statement-breakpoint
ALTER TABLE "questions" DROP CONSTRAINT "questions_player_2_users_id_fk";
--> statement-breakpoint
ALTER TABLE "questions" DROP COLUMN IF EXISTS "game_id";--> statement-breakpoint
ALTER TABLE "questions" DROP COLUMN IF EXISTS "round";--> statement-breakpoint
ALTER TABLE "questions" DROP COLUMN IF EXISTS "player_1";--> statement-breakpoint
ALTER TABLE "questions" DROP COLUMN IF EXISTS "player_2";