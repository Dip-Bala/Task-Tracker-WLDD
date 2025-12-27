import { Router } from "express";
import Task from "../models/taskSchema.js";
import { Request, Response } from "express";

export async function addTask(req: Request, res: Response) {
  const { title, description, status } = req.body;
  const user = req.user;
  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }
  try {
    const response = await Task.create({
      title,
      description,
      status,
      user: user?.id,
    });
    // console.log(response);
    return res.status(201).json({
      task: response,
      message: "New Task added successfully",
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: "Failed to create task",
    });
  }
}

export async function getAllTask(req: Request, res: Response) {
  const user = req.user;
  let tasks;
  try {
    if (user?.role === "ADMIN") {
      tasks = await Task.find({}).populate("user", "name email");
      console.log(tasks);
    } else {
      tasks = await Task.find({
        user: user?.id,
      });
    }
    // console.log(tasks);
    return res.status(200).json({ tasks });
  } catch (e) {
    return res.status(500).json({
      message: "Failed to fetch tasks",
    });
  }
}

export async function updateTask(req: Request, res: Response) {
  const taskId = req.params.id;
  if (!taskId) {
    return res.status(400).json({ message: "Task ID is required" });
  }
  const user = req.user;

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }
    // console.log(task);
    // console.log('user', req.user)
    // console.log(req.user?.id)
    if (task?.user?.toString() !== user!.id) {
      return res.status(403).json({
        message: "You are not allowed this action.",
      });
    }

    const { title, description, status } = req.body;
    task.title = title ?? task.title;
    task.description = description ?? task.description;
    task.status = status ?? task.status;

    const response = await Task.updateOne({ _id: taskId }, task);
    return res.status(200).json({
      message: "Task upadted successfully",
    });
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({
      message: "Failed to update task",
    });
  }
}

export async function deleteTask(req: Request, res: Response) {
  const taskId = req.params.id;
  // console.log(taskId);
  if (!taskId) {
    return res.status(400).json({
      message: "Task Id is required",
    });
  }
  const user = req.user;

  try {
    const task = await Task.findOne({
      _id: taskId,
    });
    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }
    // console.log(task);

    if (task?.user?.toString() !== user!.id) {
      return res.status(403).json({
        message: "You are not allowed this action.",
      });
    }

    await Task.deleteOne({
      _id: taskId,
    });
    return res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({
      message: "Failed to delete task",
    });
  }
}
