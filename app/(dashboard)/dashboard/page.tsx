"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  ShieldAlert,
  TrendingUp,
  Activity,
  ArrowUpRight,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrustTrendChart,
  ContentTypeChart,
  WeeklyAnalysisChart,
} from "@/components/charts/dashboard-charts";
import { getDashboardStats } from "@/services/dashboard-service";
import { mockDashboardStats } from "@/services/mock-data";
import type { DashboardStats } from "@/types";
import { cn, formatDate, getTrustScoreColor, getTrustScoreLabel } from "@/lib/utils";
import { TrustScoreBadge, TrustScoreLegend } from "@/components/ui/trust-score-display";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const statCardMeta = [
  {
    title: "Total Analyses",
    key: "totalAnalyses" as const,
    change: "+12.5%",
    icon: BarChart3,
    color: "text-blue-600 bg-blue-100 dark:bg-blue-900/50",
    format: (v: number) => v.toLocaleString(),
  },
  {
    title: "Trust Score Average",
    key: "trustScoreAverage" as const,
    change: "+3.2%",
    icon: TrendingUp,
    color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/50",
    format: (v: number) => `${v}%`,
  },
  {
    title: "Fake News Detected",
    key: "fakeNewsDetected" as const,
    change: "-8.1%",
    icon: ShieldAlert,
    color: "text-red-600 bg-red-100 dark:bg-red-900/50",
    format: (v: number) => v.toString(),
  },
  {
    title: "Recent Activity",
    key: "recentActivity" as const,
    change: "Today",
    icon: Activity,
    color: "text-purple-600 bg-purple-100 dark:bg-purple-900/50",
    format: (_v: unknown, stats: DashboardStats) => stats.recentActivity.length.toString(),
  },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(mockDashboardStats);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch(() => setStats(mockDashboardStats));
  }, []);

  const statCards = useMemo(
    () =>
      statCardMeta.map((meta) => ({
        ...meta,
        value:
          meta.key === "recentActivity"
            ? meta.format(null, stats)
            : meta.format(stats[meta.key] as number),
      })),
    [stats]
  );

  return (
    <DashboardShell
      title="Dashboard"
      description="Overview of your misinformation detection activity"
      action={
        <Link href="/verify">
          <Button>
            Verify Content
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </Link>
      }
    >
      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`rounded-xl p-2.5 ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    {stat.change}
                  </span>
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {stat.value}
                  </p>
                  {stat.key === "trustScoreAverage" && (
                    <p className={cn("mt-1 text-sm font-medium", getTrustScoreColor(stats.trustScoreAverage))}>
                      {getTrustScoreLabel(Math.round(stats.trustScoreAverage))}
                    </p>
                  )}
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {stat.title}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        <Card>
          <CardContent className="p-6">
            <TrustTrendChart />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <WeeklyAnalysisChart />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4 rounded-xl border border-slate-100 p-4 dark:border-slate-800"
                >
                  <div
                    className={`mt-0.5 h-2 w-2 rounded-full shrink-0 ${
                      activity.type === "analysis"
                        ? "bg-blue-500"
                        : activity.type === "alert"
                          ? "bg-red-500"
                          : "bg-emerald-500"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {activity.title}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                      {activity.description}
                    </p>
                    {activity.type === "analysis" && activity.trustScore != null && (
                      <div className="mt-2">
                        <TrustScoreBadge score={activity.trustScore} />
                      </div>
                    )}
                    <p className="mt-1 text-xs text-slate-400">
                      {formatDate(activity.timestamp)}
                    </p>
                  </div>
                  {activity.type === "analysis" && activity.trustScore != null ? (
                    <Link href={`/results/${activity.id}`}>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </Link>
                  ) : (
                    <Badge
                      variant={
                        activity.type === "analysis"
                          ? "info"
                          : activity.type === "alert"
                            ? "danger"
                            : "success"
                      }
                    >
                      {activity.type}
                    </Badge>
                  )}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Content Type Distribution */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <ContentTypeChart />
            </CardContent>
          </Card>
          <TrustScoreLegend />
        </div>
      </div>
    </DashboardShell>
  );
}
