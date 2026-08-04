import { Redis } from "ioredis";

const redisClient = new Redis({
  lazyConnect: true,
  maxRetriesPerRequest: null,
})

redisClient.on("connect", () => {
  console.log("Redis client connected");
});

redisClient.on("error", (err) => {
  console.error("Redis client error:", err);
}); 

export default redisClient;

