import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { seedReports } from "@/lib/seed-reports";
import { mapReport } from "@/lib/report-utils";
import { handleApiError, jsonError, jsonOk } from "@/lib/api-utils";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await requireAuth(request);
    const { id } = await params;
    await seedReports(prisma);

    const report = await prisma.report.findUnique({
      where: { id },
      include: { reads: { where: { userId }, take: 1 } },
    });

    if (!report) {
      return jsonError("Report not found", 404);
    }

    return jsonOk(mapReport(report, report.reads[0]));
  } catch (error) {
    return handleApiError(error);
  }
}
