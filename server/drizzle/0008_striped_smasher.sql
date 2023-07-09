ALTER TABLE "questions" ALTER COLUMN "player_1" SET NOT NULL;
ALTER TABLE "questions" ALTER COLUMN "player_2" SET NOT NULL;
ALTER TABLE "questions" ADD COLUMN "game_id" integer NOT NULL;
ALTER TABLE "questions" ADD COLUMN "round" integer NOT NULL;
ALTER TABLE "questions" ADD COLUMN "voted_on" boolean DEFAULT false NOT NULL;
ALTER TABLE "generations" DROP CONSTRAINT "generations_game_id_games_id_fk";

DO $$ BEGIN
 ALTER TABLE "questions" ADD CONSTRAINT "questions_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

ALTER TABLE "generations" DROP COLUMN IF EXISTS "game_id";
ALTER TABLE "generations" DROP COLUMN IF EXISTS "round";
ALTER TABLE "generations" DROP COLUMN IF EXISTS "voted_on";