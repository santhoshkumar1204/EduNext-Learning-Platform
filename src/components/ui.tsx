import Icon from "./Icon";
import { ReactNode } from "react";
import { cn } from "../lib/utils";

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("bg-white rounded-2xl shadow-sm border border-gray-100", className)}>{children}</div>
  );
}

export function StatCard({
  label,
  value,
  icon,
  hint,
  tone = "navy",
}: {
  label: string;
  value: ReactNode;
  icon: string;
  hint?: string;
  tone?: "green" | "navy" | "blue" | "amber" | "red";
}) {
  const tones: Record<string, string> = {
    green: "bg-[#22C55E]/10 text-[#15803D]",
    navy: "bg-navy/10 text-navy",
    blue: "bg-blue-100 text-blue-600",
    amber: "bg-amber-100 text-amber-600",
    red: "bg-red-100 text-error",
  };
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-navy mt-1">{value}</p>
          {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
        </div>
        <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center", tones[tone])}>
          <Icon name={icon} />
        </div>
      </div>
    </Card>
  );
}

export function Badge({
  children,
  tone = "gray",
}: {
  children: ReactNode;
  tone?: "green" | "amber" | "red" | "blue" | "gray" | "navy";
}) {
  const tones: Record<string, string> = {
    green: "bg-[#22C55E]/10 text-[#15803D]",
    amber: "bg-amber-100 text-amber-700",
    red: "bg-red-100 text-error",
    blue: "bg-blue-100 text-blue-700",
    gray: "bg-gray-100 text-gray-600",
    navy: "bg-navy/10 text-navy",
  };
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold", tones[tone])}>
      {children}
    </span>
  );
}

export function ProgressBar({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn("h-2.5 bg-gray-100 rounded-full overflow-hidden", className)}>
      <div className="h-full bg-[#2563EB] rounded-full transition-all" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-navy font-display">{title}</h1>
        {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Icon name={icon} className="text-5xl text-gray-300 mb-3" />
      <p className="text-gray-400">{text}</p>
    </div>
  );
}
