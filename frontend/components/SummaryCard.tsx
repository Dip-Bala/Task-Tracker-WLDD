import { CheckCircle, Clock, ListTodo } from "lucide-react";

type SummaryCardProps = {
  title: string;
  value: number;
  variant: "total" | "pending" | "done";
};

const variants = {
  total: {
    icon: <ListTodo size={22} strokeWidth={1.5} />,
    iconColor: "text-[var(--color-indigo)]",
    glow: "hover:shadow-[0_0_25px_rgba(134,128,255,0.25)]",
  },
  pending: {
    icon: <Clock size={22} strokeWidth={1.5} />,
    iconColor: "text-[var(--color-yellow)]",
    glow: "hover:shadow-[0_0_25px_rgba(255,212,0,0.25)]",
  },
  done: {
    icon: <CheckCircle size={22} strokeWidth={1.5} />,
    iconColor: "text-[var(--color-green-light)]",
    glow: "hover:shadow-[0_0_25px_rgba(71,249,69,0.25)]",
  },
};

export default function SummaryCard({
  title,
  value,
  variant,
}: SummaryCardProps) {
  const style = variants[variant];

  return (
    <div
      className={`group flex items-center justify-between rounded-2xl p-6 border border-white/5 bg-background transition-all duration-200 ${style.glow}`}
    >
      <div className="space-y-1">
        <p className="text-sm text-white/60 tracking-wide">{title}</p>
        <p className="text-3xl font-semibold tracking-tight">{value}</p>
      </div>

      <div
        className={`flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 ${style.iconColor} transition-transform duration-200 group-hover:scale-110`}
      >
        {style.icon}
      </div>
    </div>
  );
}