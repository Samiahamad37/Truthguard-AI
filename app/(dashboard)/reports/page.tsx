"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Calendar,
  Filter,
  Eye,
  X,
  FileDown,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  TrustTrendChart,
  ContentTypeChart,
  WeeklyAnalysisChart,
} from "@/components/charts/dashboard-charts";
import { useReports } from "@/hooks/use-reports";
import { cn, formatDate } from "@/lib/utils";
import type { ReportStatus } from "@/types";

export default function ReportsPage() {
  const {
    reports,
    stats,
    isLoading,
    statusFilter,
    setStatusFilter,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    unreadOnly,
    setUnreadOnly,
    hasActiveFilters,
    clearFilters,
    selectedReport,
    openReport,
    closeReport,
    handleDownload,
    handleDownloadAll,
  } = useReports();

  const [showFilters, setShowFilters] = useState(false);
  const [showDateRange, setShowDateRange] = useState(false);

  return (
    <DashboardShell
      title="Reports"
      description="Analytics reports and insights from your analyses"
      action={
        <div className="flex gap-2">
          <div className="relative">
            <Button
              variant={hasActiveFilters ? "default" : "secondary"}
              size="sm"
              onClick={() => {
                setShowFilters((v) => !v);
                setShowDateRange(false);
              }}
            >
              <Filter className="h-4 w-4" />
              Filter
              {hasActiveFilters && (
                <span className="ml-1 rounded-full bg-white/20 px-1.5 text-xs">on</span>
              )}
            </Button>
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute right-0 top-full z-20 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-4 shadow-lg dark:border-slate-700 dark:bg-slate-900"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      Filter Reports
                    </p>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Status</Label>
                      <select
                        value={statusFilter}
                        onChange={(e) =>
                          setStatusFilter(e.target.value as ReportStatus | "all")
                        }
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
                      >
                        <option value="all">All statuses</option>
                        <option value="ready">Ready</option>
                        <option value="generating">Generating</option>
                        <option value="failed">Failed</option>
                      </select>
                    </div>
                    <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <input
                        type="checkbox"
                        checked={unreadOnly}
                        onChange={(e) => setUnreadOnly(e.target.checked)}
                        className="rounded"
                      />
                      Unread only
                    </label>
                    {hasActiveFilters && (
                      <Button variant="ghost" size="sm" className="w-full" onClick={clearFilters}>
                        Clear filters
                      </Button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative">
            <Button
              variant={startDate || endDate ? "default" : "secondary"}
              size="sm"
              onClick={() => {
                setShowDateRange((v) => !v);
                setShowFilters(false);
              }}
            >
              <Calendar className="h-4 w-4" />
              Date Range
            </Button>
            <AnimatePresence>
              {showDateRange && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute right-0 top-full z-20 mt-2 w-72 rounded-xl border border-slate-200 bg-white p-4 shadow-lg dark:border-slate-700 dark:bg-slate-900"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      Date Range
                    </p>
                    <button
                      onClick={() => setShowDateRange(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="start-date" className="text-xs">
                        From
                      </Label>
                      <Input
                        id="start-date"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="end-date" className="text-xs">
                        To
                      </Label>
                      <Input
                        id="end-date"
                        type="date"
                        value={endDate}
                        min={startDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                    {(startDate || endDate) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          setStartDate("");
                          setEndDate("");
                        }}
                      >
                        Clear dates
                      </Button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Button variant="secondary" size="sm" onClick={handleDownloadAll}>
            <FileDown className="h-4 w-4" />
            Export All
          </Button>
        </div>
      }
    >
      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        {[
          { label: "Total Reports", value: String(stats.total) },
          { label: "This Month", value: String(stats.thisMonth) },
          { label: "Avg. Flag Rate", value: stats.avgFlagRate },
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
          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner label="Loading reports..." />
            </div>
          ) : reports.length === 0 ? (
            <EmptyState
              title="No reports found"
              description={
                hasActiveFilters || startDate || endDate
                  ? "Try adjusting your filters or date range"
                  : "Reports will appear here once generated"
              }
              action={
                hasActiveFilters ? (
                  <Button variant="secondary" onClick={clearFilters}>
                    Clear filters
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <div className="space-y-4">
              {reports.map((report, index) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    "flex items-center justify-between rounded-xl border p-4 transition-colors",
                    report.read
                      ? "border-slate-100 dark:border-slate-800"
                      : "border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/20"
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-slate-900 dark:text-white">
                        {report.title}
                      </p>
                      {!report.read && (
                        <span className="h-2 w-2 rounded-full bg-blue-500" title="Unread" />
                      )}
                    </div>
                    <p className="text-sm text-slate-500">
                      {report.period} · {report.analyses} analyses · {report.flagged} flagged
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-4">
                    <Badge
                      variant={
                        report.status === "ready"
                          ? "success"
                          : report.status === "failed"
                            ? "danger"
                            : "warning"
                      }
                    >
                      {report.status}
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={() => openReport(report)}>
                      <Eye className="h-4 w-4" />
                      Read
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDownload(report)}>
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Report Detail Dialog */}
      <Dialog open={!!selectedReport} onOpenChange={(open) => !open && closeReport()}>
        {selectedReport && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedReport.title}</DialogTitle>
              <DialogDescription>
                {selectedReport.period} · Generated {formatDate(selectedReport.createdAt)}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg bg-slate-50 p-3 text-center dark:bg-slate-800">
                  <p className="text-lg font-bold text-slate-900 dark:text-white">
                    {selectedReport.analyses}
                  </p>
                  <p className="text-xs text-slate-500">Analyses</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3 text-center dark:bg-slate-800">
                  <p className="text-lg font-bold text-red-500">{selectedReport.flagged}</p>
                  <p className="text-xs text-slate-500">Flagged</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3 text-center dark:bg-slate-800">
                  <p className="text-lg font-bold text-slate-900 dark:text-white">
                    {((selectedReport.flagged / selectedReport.analyses) * 100).toFixed(1)}%
                  </p>
                  <p className="text-xs text-slate-500">Flag Rate</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Summary
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {selectedReport.summary}
                </p>
              </div>
              <div className="text-xs text-slate-500">
                Date range: {selectedReport.startDate} to {selectedReport.endDate}
              </div>
              <Button
                className="w-full"
                onClick={() => handleDownload(selectedReport)}
              >
                <Download className="h-4 w-4" />
                Download Report
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </DashboardShell>
  );
}
