"use client";

import { cn, getTrustScoreProgressColor } from "@/lib/utils";

interface CircularProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  label?: string;
  showValue?: boolean;
  useTrustColors?: boolean;
}

export function CircularProgress({
  value,
  size = 120,
  strokeWidth = 8,
  className,
  label,
  showValue = true,
  useTrustColors = false,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  const strokeColor = useTrustColors
    ? getTrustScoreProgressColor(value)
    : value >= 80
      ? "stroke-emerald-500"
      : value >= 60
        ? "stroke-blue-500"
        : value >= 40
          ? "stroke-amber-500"
          : "stroke-red-500";

  return (
    <div className={cn("relative inline-flex flex-col items-center", className)}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-100 dark:text-slate-800"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn("transition-all duration-1000 ease-out", strokeColor)}
        />
      </svg>
      {showValue && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {Math.round(value)}%
          </span>
          {label && (
            <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
          )}
        </div>
      )}
    </div>
  );
}
