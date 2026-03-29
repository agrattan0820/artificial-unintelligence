DO $$ BEGIN
 IF NOT EXISTS (
  SELECT 1
  FROM information_schema.columns
  WHERE table_name = 'users' AND column_name = 'name'
 ) THEN
  ALTER TABLE "users" ADD COLUMN "name" text;
 END IF;
END $$;
--> statement-breakpoint
UPDATE "users"
SET "name" = "nickname"
WHERE "name" IS NULL AND "nickname" IS NOT NULL;
