import { Request, Response } from "express";
import z from "zod";
import { isValidObjectId } from "mongoose";
import Task from "../models/taskSchema";
import { redisClient } from "../config/redis";

const TASK_CACHE_TTL_SECONDS = 60;

function getTasksCacheKey(userId: string) {
  return `tasks:${userId}`;
}

async function invalidateTaskCache(userId: string) {
  if (!redisClient.isOpen) {
    return;
  }

  try {
    await redisClient.del(getTasksCacheKey(userId));
  } catch (error) {
    console.error("Failed to invalidate task cache:", error);
  }
}

const createTaskSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().optional(),
  status: z.enum(["pending", "completed"]).optional(),
  dueDate: z.coerce.date(),
});

const updateTaskSchema = createTaskSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required to update a task",
  });

export async function addTask(req: Request, res: Response) {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const result = createTaskSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ message: result.error.flatten() });
  }

  try {
    const task = await Task.create({
      ...result.data,
      owner: user.id,
    });
    await invalidateTaskCache(user.id);

    return res.status(201).json({
      task,
      message: "Task created successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to create task",
    });
  }
}

export async function getAllTask(req: Request, res: Response) {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const cacheKey = getTasksCacheKey(user.id);
    if (redisClient.isOpen) {
      const cachedTasks = await redisClient.get(cacheKey);

      if (cachedTasks) {
        return res.status(200).json({
          tasks: JSON.parse(cachedTasks),
          source: "cache",
        });
      }
    }

    const tasks = await Task.find({ owner: user.id })
      .sort({ createdAt: -1 })
      .lean();

    if (redisClient.isOpen) {
      await redisClient.set(cacheKey, JSON.stringify(tasks), {
        EX: TASK_CACHE_TTL_SECONDS,
      });
    }

    return res.status(200).json({ tasks });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to fetch tasks",
    });
  }
}

export async function updateTask(req: Request, res: Response) {
  const taskId = req.params.id;
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!taskId) {
    return res.status(400).json({ message: "Task ID is required" });
  }
  if (!isValidObjectId(taskId)) {
    return res.status(400).json({ message: "Invalid task ID" });
  }

  const result = updateTaskSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ message: result.error.flatten() });
  }

  try {
    const task = await Task.findOneAndUpdate(
      { _id: taskId, owner: user.id },
      { $set: result.data },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }
    await invalidateTaskCache(user.id);

    return res.status(200).json({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to update task",
    });
  }
}

export async function deleteTask(req: Request, res: Response) {
  const taskId = req.params.id;
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!taskId) {
    return res.status(400).json({ message: "Task ID is required" });
  }
  if (!isValidObjectId(taskId)) {
    return res.status(400).json({ message: "Invalid task ID" });
  }

  try {
    const deletedTask = await Task.findOneAndDelete({
      _id: taskId,
      owner: user.id,
    });

    if (!deletedTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }
    await invalidateTaskCache(user.id);

    return res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to delete task",
    });
  }
}
