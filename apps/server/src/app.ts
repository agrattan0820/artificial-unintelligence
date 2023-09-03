import dotenv from "dotenv";

// Load .env file before importing db
dotenv.config();

import { buildServer } from "./server";

const server = buildServer();

const port = process.env.PORT;

server.listen(port, async () => {
  console.log(`listening on *:${port}`);
});
