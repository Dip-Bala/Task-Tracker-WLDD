import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

let connectingPromise: Promise<typeof mongoose> | null = null;

export async function connectDB() {
  const mongodbUrl = process.env.MONGODB_URL;
  if (!mongodbUrl) {
    throw new Error("MongoDB url not loaded from env");
  }

  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (!connectingPromise) {
    connectingPromise = mongoose.connect(mongodbUrl).finally(() => {
      connectingPromise = null;
    });
  }

  try {
    await connectingPromise;
    console.log("Connected to MongoDB");
  } catch (e) {
    console.log(e);
    console.log("Error connecting to mongodb");
    throw e;
  }
}
