ALTER TABLE "generations" ADD COLUMN "voted_on" boolean DEFAULT false NOT NULL;
ALTER TABLE "questions" ADD COLUMN "player_1" integer;
ALTER TABLE "questions" ADD COLUMN "player_2" integer;
DO $$ BEGIN
 ALTER TABLE "questions" ADD CONSTRAINT "questions_player_1_users_id_fk" FOREIGN KEY ("player_1") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "questions" ADD CONSTRAINT "questions_player_2_users_id_fk" FOREIGN KEY ("player_2") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
