import { migrate } from "drizzle-orm/node-postgres/migrator";
import dotenv from "dotenv";

import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

// Load .env file before importing db
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const migrationDB = drizzle(pool);

async function runDatabaseMigrations() {
  try {
    await migrate(migrationDB, { migrationsFolder: "./drizzle" });
    console.log("Migration completed! ✅");
  } catch (error) {
    console.error("Migration failed! ❌");
    console.error(error);
  }
}

runDatabaseMigrations();
