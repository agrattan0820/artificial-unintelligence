import Redis from "ioredis";

const redis = new Redis(
  process.env.REDIS_PRIVATE_URL ?? process.env.REDIS_URL ?? ""
);

// Listen to connection events to prevent TCP Issue
// https://github.com/redis/ioredis/issues/1203

redis.on("error", (error) => {
  if ("code" in error && error.code === "ECONNRESET") {
    console.log("Connection to Redis Session Store timed out.");
  } else if ("code" in error && error.code === "ECONNREFUSED") {
    console.log("Connection to Redis Session Store refused!");
  } else console.log(error);
});

redis.on("reconnecting", () => {
  if (redis.status === "reconnecting")
    console.log("Reconnecting to Redis Session Store...");
  else console.log("Error reconnecting to Redis Session Store.");
});

redis.on("connect", () => {
  console.log("Connected to Redis Session Store!");
});

export default redis;
