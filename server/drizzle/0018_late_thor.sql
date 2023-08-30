ALTER TABLE "generations" ADD COLUMN "selected" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users_to_games" DROP COLUMN IF EXISTS "regeneration_count";