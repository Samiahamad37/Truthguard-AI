"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Shield, Sparkles, CheckCheck } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { mockNotifications } from "@/services/mock-data";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Notification } from "@/types";

const typeConfig = {
  analysis: { icon: Sparkles, color: "text-blue-600 bg-blue-100 dark:bg-blue-900/50", label: "Analysis" },
  security: { icon: Shield, color: "text-red-600 bg-red-100 dark:bg-red-900/50", label: "Security" },
  update: { icon: Bell, color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/50", label: "Update" },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <DashboardShell
      title="Notifications"
      description={`You have ${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`}
      action={
        unreadCount > 0 ? (
          <Button variant="secondary" size="sm" onClick={markAllRead}>
            <CheckCheck className="h-4 w-4" />
            Mark all read
          </Button>
        ) : undefined
      }
    >
      {notifications.length === 0 ? (
        <EmptyState
          icon={<Bell className="h-8 w-8 text-slate-400" />}
          title="No notifications"
          description="You're all caught up! New notifications will appear here."
        />
      ) : (
        <div className="space-y-3 max-w-3xl">
          {notifications.map((notification, index) => {
            const config = typeConfig[notification.type];
            const Icon = config.icon;

            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-md",
                    !notification.read && "border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-950/20"
                  )}
                  onClick={() => markRead(notification.id)}
                >
                  <CardContent className="flex items-start gap-4 p-4">
                    <div className={cn("rounded-xl p-2.5 shrink-0", config.color)}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <div className="h-2 w-2 rounded-full bg-blue-600 shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {notification.message}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {formatDate(notification.createdAt)}
                      </p>
                    </div>
                    <Badge variant="outline" className="shrink-0">
                      {config.label}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </DashboardShell>
  );
}
