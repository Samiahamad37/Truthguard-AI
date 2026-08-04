import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { seedReports } from "@/lib/seed-reports";
import { mapReport } from "@/lib/report-utils";
import { handleApiError, jsonOk } from "@/lib/api-utils";
import type { ReportStatus } from "@/types";

export async function GET(request: Request) {
  try {
    const userId = await requireAuth(request);
    await seedReports(prisma);

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const unreadOnly = searchParams.get("unreadOnly") === "true";

    const reports = await prisma.report.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        reads: { where: { userId }, take: 1 },
      },
    });

    let mapped = reports.map((report) => mapReport(report, report.reads[0]));

    if (status && status !== "all") {
      mapped = mapped.filter((r) => r.status === (status as ReportStatus));
    }
    if (startDate) {
      mapped = mapped.filter((r) => r.endDate >= startDate);
    }
    if (endDate) {
      mapped = mapped.filter((r) => r.startDate <= endDate);
    }
    if (unreadOnly) {
      mapped = mapped.filter((r) => !r.read);
    }

    return jsonOk(mapped);
  } catch (error) {
    return handleApiError(error);
  }
}
