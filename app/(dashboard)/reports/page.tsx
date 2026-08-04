"use client";

import { motion } from "framer-motion";
import { Download, Calendar, Filter } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrustTrendChart,
  ContentTypeChart,
  WeeklyAnalysisChart,
} from "@/components/charts/dashboard-charts";
const reports = [
  {
    id: "1",
    title: "Monthly Misinformation Report",
    period: "July 2026",
    analyses: 342,
    flagged: 28,
    status: "ready",
  },
  {
    id: "2",
    title: "Weekly Trust Score Summary",
    period: "Week 30, 2026",
    analyses: 89,
    flagged: 7,
    status: "ready",
  },
  {
    id: "3",
    title: "Q2 2026 Analysis Overview",
    period: "Apr - Jun 2026",
    analyses: 1024,
    flagged: 89,
    status: "ready",
  },
];

export default function ReportsPage() {
  return (
    <DashboardShell
      title="Reports"
      description="Analytics reports and insights from your analyses"
      action={
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="secondary" size="sm">
            <Calendar className="h-4 w-4" />
            Date Range
          </Button>
        </div>
      }
    >
      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        {[
          { label: "Total Reports", value: "12" },
          { label: "This Month", value: "3" },
          { label: "Avg. Flag Rate", value: "8.2%" },
        ].map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {item.value}
                </p>
                <p className="text-sm text-slate-500">{item.label}</p>
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
            <ContentTypeChart />
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardContent className="p-6">
          <WeeklyAnalysisChart />
        </CardContent>
      </Card>

      {/* Report List */}
      <Card>
        <CardHeader>
          <CardTitle>Generated Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between rounded-xl border border-slate-100 p-4 dark:border-slate-800"
              >
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {report.title}
                  </p>
                  <p className="text-sm text-slate-500">
                    {report.period} · {report.analyses} analyses · {report.flagged} flagged
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="success">{report.status}</Badge>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
