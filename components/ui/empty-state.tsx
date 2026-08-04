import { cn } from "@/lib/utils";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 py-16 px-6 text-center dark:border-slate-700 dark:bg-slate-900/30",
        className
      )}
    >
      <div className="mb-4 rounded-full bg-slate-100 p-4 dark:bg-slate-800">
        {icon ?? <Inbox className="h-8 w-8 text-slate-400" />}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
        {title}
      </h3>
      {description && (
        <p className="mb-6 max-w-sm text-sm text-slate-500 dark:text-slate-400">
          {description}
        </p>
      )}
      {action}
    </div>
  );
}
