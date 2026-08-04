import type { Report, ReportStatus } from "@/types";
import type { Report as DbReport, ReportRead } from "@prisma/client";

export function mapReport(
  report: DbReport,
  readState?: ReportRead | null
): Report {
  return {
    id: report.id,
    title: report.title,
    period: report.period,
    analyses: report.analyses,
    flagged: report.flagged,
    status: report.status as ReportStatus,
    createdAt: report.createdAt.toISOString(),
    startDate: report.startDate,
    endDate: report.endDate,
    summary: report.summary,
    read: readState?.read ?? false,
  };
}

export function computeReportStats(reports: Report[]) {
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();

  const thisMonthReports = reports.filter((r) => {
    const d = new Date(r.createdAt);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  });

  const totalAnalyses = reports.reduce((sum, r) => sum + r.analyses, 0);
  const totalFlagged = reports.reduce((sum, r) => sum + r.flagged, 0);
  const avgFlagRate =
    totalAnalyses > 0 ? ((totalFlagged / totalAnalyses) * 100).toFixed(1) : "0.0";

  return {
    total: reports.length,
    thisMonth: thisMonthReports.length,
    avgFlagRate: `${avgFlagRate}%`,
  };
}
