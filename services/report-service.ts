import type { Report, ReportStatus } from "@/types";
import apiClient from "@/services/api-client";
import { downloadCsv, downloadJson } from "@/lib/download";

export interface ReportFilters {
  status?: ReportStatus | "all";
  startDate?: string;
  endDate?: string;
  unreadOnly?: boolean;
}

export interface ReportStats {
  total: number;
  thisMonth: number;
  avgFlagRate: string;
}

export async function getReports(filters?: ReportFilters): Promise<Report[]> {
  const { data } = await apiClient.get<Report[]>("/reports", {
    params: {
      status: filters?.status,
      startDate: filters?.startDate,
      endDate: filters?.endDate,
      unreadOnly: filters?.unreadOnly ? "true" : undefined,
    },
  });
  return data;
}

export async function getReportStats(): Promise<ReportStats> {
  const { data } = await apiClient.get<ReportStats>("/reports/stats");
  return data;
}

export async function getReportById(id: string): Promise<Report | null> {
  try {
    const { data } = await apiClient.get<Report>(`/reports/${id}`);
    return data;
  } catch {
    return null;
  }
}

export async function markReportAsRead(id: string): Promise<Report | null> {
  try {
    const { data } = await apiClient.patch<Report>(`/reports/${id}/read`);
    return data;
  } catch {
    return null;
  }
}

export function downloadReport(report: Report, format: "json" | "csv" = "json"): void {
  const safeName = report.title.replace(/[^a-z0-9]/gi, "_").toLowerCase();

  if (format === "csv") {
    downloadCsv(
      [
        {
          title: report.title,
          period: report.period,
          analyses: report.analyses,
          flagged: report.flagged,
          status: report.status,
          flagRate: `${((report.flagged / report.analyses) * 100).toFixed(1)}%`,
          summary: report.summary,
        },
      ],
      `${safeName}.csv`
    );
    return;
  }

  downloadJson(
    {
      id: report.id,
      title: report.title,
      period: report.period,
      dateRange: { start: report.startDate, end: report.endDate },
      analyses: report.analyses,
      flagged: report.flagged,
      flagRate: `${((report.flagged / report.analyses) * 100).toFixed(1)}%`,
      status: report.status,
      summary: report.summary,
      generatedAt: report.createdAt,
    },
    `${safeName}.json`
  );
}

export function downloadAllReports(reports: Report[]): void {
  downloadJson(
    reports.map((r) => ({
      id: r.id,
      title: r.title,
      period: r.period,
      analyses: r.analyses,
      flagged: r.flagged,
      status: r.status,
      summary: r.summary,
      createdAt: r.createdAt,
    })),
    "truthguard_reports_export.json"
  );
}
