"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/app/lib/api";
import { useState } from "react";
import TaskCard from "@/components/TaskCard";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { statusStyles, type TaskStatus } from "@/app/lib/taskStyle";

type Task = {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate: string;
};

type TaskPayload = {
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate: string;
};

function statusLabel(status: TaskStatus) {
  return status === "pending" ? "Pending" : "Completed";
}

export default function TasksPage() {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await api.get("/tasks");
      return res.data.tasks;
    },
  });

  const createTask = useMutation({
    mutationFn: (data: TaskPayload) => api.post("/tasks", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setIsCreating(false);
    },
  });

  const updateTask = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TaskPayload> }) =>
      api.put(`/tasks/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setEditingId(null);
    },
  });

  const deleteTask = useMutation({
    mutationFn: (id: string) => api.delete(`/tasks/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  return (
    <div className="space-y-10 max-w-6xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>

        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-5 py-2 rounded-2xl bg-indigo text-white hover:opacity-90 transition cursor-pointer"
        >
          <Plus size={18} />
          Add Task
        </button>
      </div>

      {isCreating && (
        <TaskCard
          onSave={(data) => createTask.mutate(data)}
          onCancel={() => setIsCreating(false)}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 ">
        {tasks.map((task) =>
          editingId === task._id ? (
            <TaskCard
              key={task._id}
              task={task}
              onSave={(data) =>
                updateTask.mutate({ id: task._id, data })
              }
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <div
              key={task._id}
              className="bg-muted-background border border-white/5 rounded-2xl p-6 flex justify-between items-start gap-6 transition hover:border-indigo"
            >
              <div className="space-y-3">
                <h3 className="text-lg font-semibold tracking-tight">
                  {task.title}
                </h3>

                {task.description && (
                  <p className="text-sm text-white/60">
                    {task.description}
                  </p>
                )}

                <p className="text-xs text-foreground bg-blue/20 py-1 px-3 rounded-2xl">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </p>

                <span
                  className={`${statusStyles[task.status].bg} ${statusStyles[task.status].text} px-3 py-1 rounded-full text-xs font-medium w-fit`}
                >
                  {statusLabel(task.status)}
                </span>
                
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setEditingId(task._id)}
                  className="text-blue hover:bg-background p-2 rounded-lg transition cursor-pointer"
                >
                  <Pencil strokeWidth={1.5} />
                </button>

                <button
                  onClick={() => deleteTask.mutate(task._id)}
                  className="text-red hover:bg-red/10 p-2 rounded-lg transition cursor-pointer"
                >
                  <Trash2 strokeWidth={1.5} />
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
