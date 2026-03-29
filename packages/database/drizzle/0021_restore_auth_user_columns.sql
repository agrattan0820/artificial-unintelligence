DO $$ BEGIN
 IF NOT EXISTS (
  SELECT 1
  FROM information_schema.columns
  WHERE table_name = 'users' AND column_name = 'email'
 ) THEN
  ALTER TABLE "users" ADD COLUMN "email" text;
 END IF;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 IF NOT EXISTS (
  SELECT 1
  FROM information_schema.columns
  WHERE table_name = 'users' AND column_name = 'email_verified'
 ) THEN
  ALTER TABLE "users" ADD COLUMN "email_verified" timestamp;
 END IF;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 IF NOT EXISTS (
  SELECT 1
  FROM information_schema.columns
  WHERE table_name = 'users' AND column_name = 'image'
 ) THEN
  ALTER TABLE "users" ADD COLUMN "image" text;
 END IF;
END $$;
--> statement-breakpoint
UPDATE "users"
SET "email" = CONCAT('legacy+', "id", '@artificialunintelligence.invalid')
WHERE "email" IS NULL;
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL;
