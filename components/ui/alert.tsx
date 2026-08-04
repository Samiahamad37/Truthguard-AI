import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from "lucide-react";

const icons = {
  default: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: AlertCircle,
};

interface AlertProps {
  variant?: keyof typeof icons;
  title?: string;
  children: React.ReactNode;
  className?: string;
  onDismiss?: () => void;
}

export function Alert({ variant = "default", title, children, className, onDismiss }: AlertProps) {
  const Icon = icons[variant];

  const variantStyles = {
    default: "border-blue-200 bg-blue-50/80 text-blue-800 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-200",
    success: "border-emerald-200 bg-emerald-50/80 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200",
    warning: "border-amber-200 bg-amber-50/80 text-amber-800 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-200",
    error: "border-red-200 bg-red-50/80 text-red-800 dark:border-red-800 dark:bg-red-950/50 dark:text-red-200",
  };

  return (
    <div
      role="alert"
      className={cn(
        "relative flex gap-3 rounded-xl border p-4 backdrop-blur-sm",
        variantStyles[variant],
        className
      )}
    >
      <Icon className="h-5 w-5 shrink-0 mt-0.5" />
      <div className="flex-1">
        {title && <h5 className="mb-1 font-medium">{title}</h5>}
        <div className="text-sm opacity-90">{children}</div>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute top-3 right-3 opacity-60 hover:opacity-100 transition-opacity"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
