ALTER TABLE "games" ADD COLUMN "state" text NOT NULL;
ALTER TABLE "games" ADD COLUMN "round" integer NOT NULL;
ALTER TABLE "votes" ADD COLUMN "generation_id" integer NOT NULL;
DO $$ BEGIN
 ALTER TABLE "votes" ADD CONSTRAINT "votes_generation_id_generations_id_fk" FOREIGN KEY ("generation_id") REFERENCES "generations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
