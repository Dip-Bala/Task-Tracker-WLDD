import type { Request } from "express";
import { describe, test, expect, afterEach, jest } from "@jest/globals";

import Task from "../../src/models/taskSchema";
import { addTask, deleteTask, updateTask } from "../../src/controllers/taskController";

// Mock redis module (since controller uses it internally)
jest.mock("../../src/config/redis", () => ({
  redisClient: {
    isOpen: false,
    del: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
  },
}));

function mockResponse() {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe("Task Controller Unit Tests", () => {

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("addTask should return 401 if user missing", async () => {
    const req = { body: {} } as Request;
    const res = mockResponse();

    await addTask(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  test("addTask should create task successfully", async () => {
    const req = {
      user: { id: "user123" },
      body: {
        title: "Test Task",
        dueDate: "2026-03-01",
      },
    } as any;

    const res = mockResponse();

    jest.spyOn(Task, "create").mockResolvedValue({
      _id: "task123",
      title: "Test Task",
    } as any);

    await addTask(req, res);

    expect(Task.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test("updateTask should return 404 if task not found", async () => {
  const req = {
    user: { id: "user123" },
    params: { id: "507f1f77bcf86cd799439011" },
    body: { title: "Updated" },
  } as any;

  const res = mockResponse();

  jest.spyOn(Task, "findOneAndUpdate").mockResolvedValue(null as any);

  await updateTask(req, res);

  expect(res.status).toHaveBeenCalledWith(404);
});

test("deleteTask should delete successfully", async () => {
  const req = {
    user: { id: "user123" },
    params: { id: "507f1f77bcf86cd799439011" },
  } as any;

  const res = mockResponse();

  jest.spyOn(Task, "findOneAndDelete").mockResolvedValue({ _id: "task123" } as any);

  await deleteTask(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
});

});