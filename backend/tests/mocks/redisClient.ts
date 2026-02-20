import { jest } from "@jest/globals";
import redis from "redis-mock";

const rawClient = redis.createClient();

export const redisClient = {
  isOpen: true,
  get: jest.fn((key: string) => rawClient.get(key)),
  set: jest.fn((key: string, value: string) => rawClient.set(key, value)),
  del: jest.fn((key: string) => rawClient.del(key)),
  connect: jest.fn(),
  quit: jest.fn(),
  on: jest.fn(),
};

export const connectRedis = jest.fn();
export const disconnectRedis = jest.fn();

export async function resetRedisMock() {
  rawClient.flushall();
  redisClient.get.mockClear();
  redisClient.set.mockClear();
  redisClient.del.mockClear();
}