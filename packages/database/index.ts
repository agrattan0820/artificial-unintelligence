import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const client = postgres(
  process.env.POSTGRES_URL ?? process.env.DATABASE_URL ?? "",
);

export const db = drizzle(client);
export * from "./schema";
