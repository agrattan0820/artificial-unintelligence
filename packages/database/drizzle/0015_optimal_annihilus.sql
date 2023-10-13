ALTER TABLE "votes" DROP CONSTRAINT "votes_generation_id_generations_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "votes" ADD CONSTRAINT "votes_generation_id_generations_id_fk" FOREIGN KEY ("generation_id") REFERENCES "generations"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
