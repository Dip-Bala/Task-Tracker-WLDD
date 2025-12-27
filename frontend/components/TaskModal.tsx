"use client";

import { useState } from "react";

type TaskStatus = "PENDING" | "WORKING ON" | "DONE"
type Props = {
  onClose: () => void;
  onSubmit: (data: any) => void;
  defaultValues?: {
    title: string;
    description?: string;
    status: TaskStatus;
  } | null;
};

export default function TaskModal({
  onClose,
  onSubmit,
  defaultValues,
}: Props) {
  const [title, setTitle] = useState(defaultValues?.title || "");
  const [description, setDescription] = useState(defaultValues?.description || "");
  const [status, setStatus] = useState<TaskStatus>(
    defaultValues?.status || "PENDING"
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-[350px] space-y-4">
        <h3 className="font-semibold text-lg">
          {defaultValues ? "Edit Task" : "New Task"}
        </h3>

        <input
          placeholder="Title"
          className="w-full border px-3 py-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Description"
          className="w-full border px-3 py-2 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select
          className="w-full border px-3 py-2 rounded"
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
        >
          <option value="PENDING">Pending</option>
          <option value="DONE">Done</option>
        </select>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="border px-3 py-1 rounded">
            Cancel
          </button>
          <button
            onClick={() =>
              onSubmit({ title, description, status })
            }
            className="bg-foreground text-background px-4 py-1 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
