CREATE TABLE IF NOT EXISTS "rooms" (
	"code" text PRIMARY KEY NOT NULL,
	"host_id" integer
);

CREATE TABLE IF NOT EXISTS "user_rooms" (
	"user_id" integer,
	"room_code" text
);

ALTER TABLE "users" RENAME COLUMN "full_name" TO "nickname";
ALTER TABLE "users" DROP COLUMN IF EXISTS "phone";
DO $$ BEGIN
 ALTER TABLE "rooms" ADD CONSTRAINT "rooms_host_id_users_id_fk" FOREIGN KEY ("host_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "user_rooms" ADD CONSTRAINT "user_rooms_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "user_rooms" ADD CONSTRAINT "user_rooms_room_code_rooms_code_fk" FOREIGN KEY ("room_code") REFERENCES "rooms"("code") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
