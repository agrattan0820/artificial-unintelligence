ALTER TABLE "games" ALTER COLUMN "room_code" SET NOT NULL;
ALTER TABLE "user_rooms" ALTER COLUMN "user_id" SET NOT NULL;
ALTER TABLE "user_rooms" ALTER COLUMN "room_code" SET NOT NULL;
ALTER TABLE "generations" ADD COLUMN "user_id" integer NOT NULL;
ALTER TABLE "generations" ADD COLUMN "question_id" integer NOT NULL;
ALTER TABLE "generations" ADD COLUMN "round" integer NOT NULL;
ALTER TABLE "generations" ADD COLUMN "image_url" text NOT NULL;
ALTER TABLE "games" DROP CONSTRAINT "games_first_question_id_questions_id_fk";

ALTER TABLE "games" DROP CONSTRAINT "games_second_question_id_questions_id_fk";

ALTER TABLE "games" DROP CONSTRAINT "games_third_question_id_questions_id_fk";

DO $$ BEGIN
 ALTER TABLE "generations" ADD CONSTRAINT "generations_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "generations" ADD CONSTRAINT "generations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "generations" ADD CONSTRAINT "generations_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

ALTER TABLE "games" DROP COLUMN IF EXISTS "first_question_id";
ALTER TABLE "games" DROP COLUMN IF EXISTS "second_question_id";
ALTER TABLE "games" DROP COLUMN IF EXISTS "third_question_id";