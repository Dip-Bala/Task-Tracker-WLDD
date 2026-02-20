export type TaskStatus = "pending" | "completed";


export const statusStyles: Record<TaskStatus, { bg: string; text: string }> = {
  pending: {
    bg: "bg-yellow/15",
    text: "text-yellow",
  },
  completed: {
    bg: "bg-green-light/15",
    text: "text-green-light",
  },
};
