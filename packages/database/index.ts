import { drizzle } from "drizzle-orm/postgres-js";
import { sql } from "drizzle-orm";
import postgres from "postgres";

const client = postgres(
  process.env.POSTGRES_URL ?? process.env.DATABASE_URL ?? "",
);

export const db = drizzle(client);

/**
 * Ping the database to verify the connection is working.
 * Throws an error if the connection fails.
 */
export async function pingDatabase(): Promise<void> {
  await db.execute(sql`SELECT 1`);
}

export * from "./schema";
