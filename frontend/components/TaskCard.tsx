"use client";

import { useState } from "react";

type TaskStatus = "pending" | "completed";

type Props = {
  task?: {
    _id?: string;
    title: string;
    description?: string;
    status: TaskStatus;
    dueDate: string;
  };
  onSave: (data: {
    title: string;
    description?: string;
    status: TaskStatus;
    dueDate: string;
  }) => void;
  onCancel: () => void;
};

export default function TaskCard({
  task,
  onSave,
  onCancel,
}: Props) {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [status, setStatus] = useState<TaskStatus>(task?.status || "pending");
  const [dueDate, setDueDate] = useState(task?.dueDate?.slice(0, 10) || "");

  return (
    <div className="bg-muted-background border border-white/5 rounded-2xl p-6 space-y-5 shadow-[0_0_30px_rgba(0,0,0,0.25)]">
      
      <div className="space-y-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-lg font-medium placeholder:text-white/30 focus:outline-none focus:border-indigo focus:ring-1 focus:ring-indigo transition"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          rows={3}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white/80 placeholder:text-white/30 focus:outline-none focus:border-indigo focus:ring-1 focus:ring-indigo transition resize-none"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as TaskStatus)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo focus:ring-1 focus:ring-[indigo transition"
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>

        <div className="space-y-1">
          <label className="text-xs uppercase tracking-wider text-white/40">
            Due Date
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full bg-indigo/10 border border-indigo/40 rounded-xl px-4 py-3 text-sm text-indigo font-medium focus:outline-none focus:ring-2 focus:ring-indigo/40 transition"
            required
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition cursor-pointer"
        >
          Cancel
        </button>

        <button
          disabled={!title.trim() || !dueDate}
          onClick={() => onSave({ title, description, status, dueDate })}
          className="px-5 py-2 rounded-xl bg-indigo text-white font-medium hover:opacity-90 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Save
        </button>
      </div>
    </div>
  );
}
