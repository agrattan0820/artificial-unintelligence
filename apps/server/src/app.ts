import { pingDatabase } from "database";
import { buildServer } from "./server";

const server = buildServer();

const port = Number.parseInt(process.env.PORT ?? "8080");

server.listen(port, async () => {
  console.log(`listening on *:${port}`);

  try {
    await pingDatabase();
    console.log("Connected to PostgreSQL database!");
  } catch (error) {
    console.error("Failed to connect to PostgreSQL database!", error);
  }
});
