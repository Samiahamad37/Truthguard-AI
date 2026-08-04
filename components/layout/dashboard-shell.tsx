"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export function DashboardShell({
  children,
  title,
  description,
  action,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-white dark:from-slate-950 dark:via-blue-950/20 dark:to-slate-950">
      <Sidebar />
      <main className="pl-64 transition-all duration-300 min-h-screen">
        <div className="mx-auto max-w-7xl px-6 py-8">
          {(title || action) && (
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                {title && (
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {title}
                  </h1>
                )}
                {description && (
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {description}
                  </p>
                )}
              </div>
              {action}
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  );
}
