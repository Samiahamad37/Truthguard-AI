"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import type { Report, ReportStatus } from "@/types";
import {
  getReports,
  getReportStats,
  markReportAsRead,
  downloadReport,
  downloadAllReports,
  type ReportFilters,
  type ReportStats,
} from "@/services/report-service";

export function useReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState<ReportStats>({
    total: 0,
    thisMonth: 0,
    avgFlagRate: "0.0%",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<ReportStatus | "all">("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const filters: ReportFilters = useMemo(
    () => ({
      status: statusFilter,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      unreadOnly,
    }),
    [statusFilter, startDate, endDate, unreadOnly]
  );

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    try {
      const [reportData, statsData] = await Promise.all([
        getReports(filters),
        getReportStats(),
      ]);
      setReports(reportData);
      setStats(statsData);
    } catch {
      setReports([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const openReport = useCallback(
    async (report: Report) => {
      const updated = await markReportAsRead(report.id);
      setSelectedReport(updated ?? report);
      fetchReports();
    },
    [fetchReports]
  );

  const closeReport = useCallback(() => {
    setSelectedReport(null);
  }, []);

  const handleDownload = useCallback((report: Report) => {
    downloadReport(report);
  }, []);

  const handleDownloadAll = useCallback(() => {
    downloadAllReports(reports);
  }, [reports]);

  const clearFilters = useCallback(() => {
    setStatusFilter("all");
    setStartDate("");
    setEndDate("");
    setUnreadOnly(false);
  }, []);

  const hasActiveFilters =
    statusFilter !== "all" || !!startDate || !!endDate || unreadOnly;

  return {
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
    refetch: fetchReports,
  };
}
