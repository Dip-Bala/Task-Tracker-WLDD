import SummaryCard from "@/components/SummaryCard";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { statusStyles } from "../lib/taskStyle";

type TaskStatus = "pending" | "completed";

type Task = {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate: string;
};


function statusLabel(status: TaskStatus) {
  return status === "pending" ? "Pending" : "Completed";
}

async function getTasksForDashboard(): Promise<Task[]> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!backendUrl) return [];

  const cookieStore = await cookies();

  const response = await fetch(`${backendUrl}/api/tasks`, {
    headers: {
      cookie: cookieStore.toString(),
    },
    cache: "no-store",
  });

  if (response.status === 401) redirect("/login");
  if (!response.ok) return [];

  const data = (await response.json()) as { tasks?: Task[] };
  return data.tasks ?? [];
}

export default async function DashboardPage() {
  const tasks = await getTasksForDashboard();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const pendingTasks = tasks.filter((t) => t.status === "pending").length;

  return (
    <div className="space-y-10 max-w-6xl mx-auto px-6 py-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Dashboard
        </h1>
        <p className="text-sm text-white/50 mt-1">
          Overview of your tasks and progress
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-muted-background rounded-2xl border border-white/5">
        <SummaryCard title="Total Tasks" value={totalTasks} variant="total" />
        <SummaryCard title="Pending" value={pendingTasks} variant="pending" />
        <SummaryCard title="Completed" value={completedTasks} variant="done" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.length === 0 && (
          <div className="col-span-full bg-muted-background border border-white/5 rounded-xl p-8 text-center text-white/50">
            No tasks found.
          </div>
        )}

        {tasks.map((task) => (
          <div
            key={task._id}
            className="bg-muted-background rounded-xl border border-white/5 p-6 flex flex-col justify-between gap-4 transition-all duration-200 hover:border-indigo hover:shadow-[0_0_20px_rgba(134,128,255,0.15)]"
          >
            <div className="space-y-3">
              <h3 className="font-semibold text-lg tracking-tight">
                {task.title}
              </h3>

              {task.description && (
                <p className="text-sm text-white/60 leading-relaxed">
                  {task.description}
                </p>
              )}

              <p className="text-xs text-white/40">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </p>
            </div>

            <span
              className={`${statusStyles[task.status].bg} ${statusStyles[task.status].text} px-3 py-1 rounded-full text-xs font-medium tracking-wide w-fit`}
            >
              {statusLabel(task.status)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}