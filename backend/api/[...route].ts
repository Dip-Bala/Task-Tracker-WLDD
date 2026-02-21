import type { IncomingMessage, ServerResponse } from "http";
import app from "../src/app";
import { connectDB } from "../src/config/db";
import { connectRedis } from "../src/config/redis";

let isBootstrapped = false;
let bootstrapPromise: Promise<void> | null = null;

async function bootstrapConnections() {
  if (isBootstrapped) {
    return;
  }

  if (!bootstrapPromise) {
    bootstrapPromise = (async () => {
      await connectDB();

      try {
        await connectRedis();
      } catch (error) {
        console.error("Failed to connect Redis. Continuing without cache.");
      }

      isBootstrapped = true;
    })().finally(() => {
      bootstrapPromise = null;
    });
  }

  await bootstrapPromise;
}

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse
) {
  await bootstrapConnections();
  return (app as unknown as (req: IncomingMessage, res: ServerResponse) => void)(
    req,
    res
  );
}
