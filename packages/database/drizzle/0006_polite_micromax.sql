ALTER TABLE "questions_to_games" DROP CONSTRAINT "questions_to_games_player_2_users_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "questions_to_games" ADD CONSTRAINT "questions_to_games_player_2_users_id_fk" FOREIGN KEY ("player_2") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
