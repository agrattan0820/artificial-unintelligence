ALTER TABLE "users_to_rooms" DROP CONSTRAINT "users_to_rooms_room_code_rooms_code_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_rooms" ADD CONSTRAINT "users_to_rooms_room_code_rooms_code_fk" FOREIGN KEY ("room_code") REFERENCES "rooms"("code") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
