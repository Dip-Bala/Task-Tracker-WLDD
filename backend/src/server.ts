import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { connectDB } from "./config/db";
import { connectRedis } from "./config/redis";

const PORT = process.env.PORT || 3001;

async function main() {
  try {
    await connectDB();
  } catch (e) {
    console.log("Error connecting to MongoDB");
  }

  try {
    await connectRedis();
  } catch (error) {
    console.error("Failed to connect Redis. Continuing without cache.");
  }

  app.listen(PORT, () =>
    console.log("app is running on port " + PORT)
  );
}

main();