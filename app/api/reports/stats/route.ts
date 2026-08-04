import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { seedReports } from "@/lib/seed-reports";
import { computeReportStats, mapReport } from "@/lib/report-utils";
import { handleApiError, jsonOk } from "@/lib/api-utils";

export async function GET(request: Request) {
  try {
    const userId = await requireAuth(request);
    await seedReports(prisma);

    const reports = await prisma.report.findMany({
      include: { reads: { where: { userId }, take: 1 } },
    });

    const mapped = reports.map((report) => mapReport(report, report.reads[0]));
    return jsonOk(computeReportStats(mapped));
  } catch (error) {
    return handleApiError(error);
  }
}
