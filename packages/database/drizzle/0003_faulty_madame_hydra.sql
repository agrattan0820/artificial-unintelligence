CREATE TABLE IF NOT EXISTS "games" (
	"id" serial PRIMARY KEY NOT NULL,
	"room_code" text,
	"first_question_id" integer,
	"second_question_id" integer,
	"third_question_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp
);

CREATE TABLE IF NOT EXISTS "generations" (
	"id" serial PRIMARY KEY NOT NULL,
	"game_id" integer NOT NULL,
	"text" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"text" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "votes" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);

ALTER TABLE "rooms" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;
ALTER TABLE "user_rooms" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;
ALTER TABLE "users" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;
ALTER TABLE "rooms" DROP CONSTRAINT "rooms_host_id_users_id_fk";

ALTER TABLE "rooms" DROP COLUMN IF EXISTS "host_id";
DO $$ BEGIN
 ALTER TABLE "games" ADD CONSTRAINT "games_room_code_rooms_code_fk" FOREIGN KEY ("room_code") REFERENCES "rooms"("code") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "games" ADD CONSTRAINT "games_first_question_id_questions_id_fk" FOREIGN KEY ("first_question_id") REFERENCES "questions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "games" ADD CONSTRAINT "games_second_question_id_questions_id_fk" FOREIGN KEY ("second_question_id") REFERENCES "questions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "games" ADD CONSTRAINT "games_third_question_id_questions_id_fk" FOREIGN KEY ("third_question_id") REFERENCES "questions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "votes" ADD CONSTRAINT "votes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

ALTER TABLE "user_rooms" ADD CONSTRAINT "user_rooms_user_id_room_code" PRIMARY KEY("user_id","room_code");