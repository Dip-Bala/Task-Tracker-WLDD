import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import app from "../../src/app";
import { afterAll, afterEach, beforeAll, describe, expect, jest, test } from "@jest/globals";
import { redisClient, resetRedisMock } from "../mocks/redisClient";

jest.mock("../../src/config/redis", () =>
  require("../mocks/redisClient")
);

let mongoServer: MongoMemoryServer;

describe("Task API Integration Tests (with Redis behavior)", () => {
  let agent: request.SuperAgentTest;
  let taskId: string;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
    agent = request.agent(app) as unknown as request.SuperAgentTest;
  });

  afterEach(async () => {
    await mongoose.connection.db?.dropDatabase();
    await resetRedisMock();
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  test("Unauthorized access to tasks should return 401", async () => {
    const res = await request(app).get("/api/tasks");
    expect(res.status).toBe(401);
  });

  test("Full CRUD + Cache behavior flow", async () => {
    // Signup
    await agent.post("/api/auth/signup").send({
      name: "Test User",
      email: "test@test.com",
      password: "123456",
    }).expect(201);

    // Login
    await agent.post("/api/auth/login").send({
      email: "test@test.com",
      password: "123456",
    }).expect(200);

    // Create Task (cache should invalidate)
    const createRes = await agent.post("/api/tasks").send({
      title: "Integration Task",
      dueDate: "2026-03-01",
    }).expect(201);

    taskId = createRes.body.task._id;
    expect(redisClient.del).toHaveBeenCalledTimes(1);

    // First GET → cache miss → DB → set cache
    const firstGet = await agent.get("/api/tasks").expect(200);
    expect(firstGet.body.source).toBeUndefined();
    expect(redisClient.set).toHaveBeenCalledTimes(1);

    // Second GET → cache hit
    const secondGet = await agent.get("/api/tasks").expect(200);
    expect(secondGet.body.source).toBe("cache");
    expect(redisClient.get).toHaveBeenCalled();

    // Update Task → invalidate cache
    await agent.put(`/api/tasks/${taskId}`).send({
      status: "completed",
    }).expect(200);

    expect(redisClient.del).toHaveBeenCalledTimes(2);

    // Delete Task → invalidate cache
    await agent.delete(`/api/tasks/${taskId}`).expect(200);

    expect(redisClient.del).toHaveBeenCalledTimes(3);
  });

  test("Invalid ObjectId should return 400", async () => {
    await agent.post("/api/auth/signup").send({
      name: "Test User2",
      email: "test2@test.com",
      password: "123456",
    });

    await agent.post("/api/auth/login").send({
      email: "test2@test.com",
      password: "123456",
    });

    const res = await agent.put("/api/tasks/invalid-id").send({
      title: "Updated",
    });

    expect(res.status).toBe(400);
  });
});