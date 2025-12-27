"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TaskModal from "@/components/TaskModal";

type Task = {
  _id: string;
  title: string;
  description?: string;
  status: "PENDING"| "WORKING ON" | "DONE";
};

export default function TasksPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // ─────────────────── AUTH CHECK ───────────────────
  const { data: user, isError } = useQuery({
    queryKey: ["me"],
    queryFn: () => api.get("/auth/me").then(res => res.data),
    retry: false,
  });

  useEffect(() => {
    if (isError) router.replace("/login");
  }, [isError, router]);

  const { data: tasks, isLoading } = useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: () => api.get("/tasks").then(res => res.data.tasks),
  });


  const createTask = useMutation({
    mutationFn: (data: Partial<Task>) => api.post("/tasks", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setShowModal(false);
    },
  });

  const updateTask = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Task> }) =>
      api.put(`/tasks/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setShowModal(false);
      setEditingTask(null);
    },
  });

  const deleteTask = useMutation({
    mutationFn: (id: string) => api.delete(`/tasks/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (!user) return null;

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Tasks</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-foreground text-background px-4 py-2 rounded-md"
        >
          + Add Task
        </button>
      </div>


      <div className="space-y-3">
        {tasks?.length === 0 && <p>No tasks yet.</p>}

        {tasks?.map((task) => (
          <div
            key={task._id}
            className="border rounded-md p-4 flex justify-between items-center"
          >
            <div>
              <h3 className="font-medium">{task.title}</h3>
              <p className="text-sm text-gray-500">{task.description}</p>
              <span className="text-xs">
                Status:{" "}
                <span
                  className={
                    task.status === "DONE"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }
                >
                  {task.status}
                </span>
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditingTask(task);
                  setShowModal(true);
                }}
                className="text-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => deleteTask.mutate(task._id)}
                className="text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>


      {showModal && (
        <TaskModal
          onClose={() => {
            setShowModal(false);
            setEditingTask(null);
          }}
          onSubmit={(data) => {
            if (editingTask) {
              updateTask.mutate({ id: editingTask._id, data });
            } else {
              createTask.mutate(data);
            }
          }}
          defaultValues={editingTask}
        />
      )}
    </div>
  );
}
