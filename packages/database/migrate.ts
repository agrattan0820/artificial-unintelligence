import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import dotenv from "dotenv";
import postgres from "postgres";

// Load .env file before importing db
dotenv.config();

const client = postgres(
  process.env.POSTGRES_URL ?? process.env.DATABASE_URL ?? ""
);

const migrationDB = drizzle(client);

async function runDatabaseMigrations() {
  try {
    await migrate(migrationDB, { migrationsFolder: "./drizzle" });
    console.log("Migration completed! ✅");
    process.exit();
  } catch (error) {
    console.error("Migration failed! ❌");
    console.error(error);
  }
}

runDatabaseMigrations();
