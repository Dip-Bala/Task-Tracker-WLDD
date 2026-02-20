import { createClient } from "redis";

const {REDIS_USERNAME, REDIS_PASSWORD, REDIS_HOST, REDIS_PORT} = process.env;
if(!REDIS_USERNAME || !REDIS_PASSWORD || !REDIS_HOST || !REDIS_PORT){
  console.log("Redis environment varibales are not available")
}

export const redisClient = createClient({
    username: REDIS_USERNAME as string,
    password: REDIS_PASSWORD as string,
    socket: {
        host: REDIS_HOST as string,
        port: Number(REDIS_PORT) 
    }
}); 

if (process.env.NODE_ENV === "test") {
  console.log("Redis disabled in test environment");
} else {
  redisClient.on("error", (error) => {
    console.error("Redis Client Error:", error);
  });
}

export async function connectRedis() {
  if (process.env.NODE_ENV === "test") {
    return;
  }

  if (redisClient.isOpen) return;

  await redisClient.connect();
  console.log("Connected to Redis");
}

export async function disconnectRedis() {
  if (!redisClient.isOpen) {
    return;
  }

  await redisClient.quit();
}
