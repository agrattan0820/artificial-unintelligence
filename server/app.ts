import dotenv from "dotenv";

// Load .env file before importing db
dotenv.config();

import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "./db/db";
import { buildServer } from "./server";

const server = buildServer();

const port = process.env.PORT;

server.listen(port, async () => {
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log(`listening on *:${port}`);
});
