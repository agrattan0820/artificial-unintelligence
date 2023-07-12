ALTER TABLE "user_games" RENAME TO "users_games";--> statement-breakpoint
ALTER TABLE "user_rooms" RENAME TO "users_rooms";--> statement-breakpoint
ALTER TABLE "users_games" DROP CONSTRAINT "user_games_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "users_games" DROP CONSTRAINT "user_games_game_id_games_id_fk";
--> statement-breakpoint
ALTER TABLE "users_rooms" DROP CONSTRAINT "user_rooms_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "users_rooms" DROP CONSTRAINT "user_rooms_room_code_rooms_code_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_games" ADD CONSTRAINT "users_games_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_games" ADD CONSTRAINT "users_games_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_rooms" ADD CONSTRAINT "users_rooms_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_rooms" ADD CONSTRAINT "users_rooms_room_code_rooms_code_fk" FOREIGN KEY ("room_code") REFERENCES "rooms"("code") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
