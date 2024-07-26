import dotenv from "dotenv";

// Load .env file before importing db
dotenv.config();

import { buildServer } from "./server";

const server = buildServer();

const port = Number.parseInt(process.env.PORT ?? "8080");

server.listen(port, async () => {
  console.log(`listening on *:${port}`);
});
