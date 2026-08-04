import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { mapReport } from "@/lib/report-utils";
import { handleApiError, jsonError, jsonOk } from "@/lib/api-utils";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await requireAuth(request);
    const { id } = await params;

    const report = await prisma.report.findUnique({ where: { id } });
    if (!report) {
      return jsonError("Report not found", 404);
    }

    const readState = await prisma.reportRead.upsert({
      where: { userId_reportId: { userId, reportId: id } },
      create: { userId, reportId: id, read: true },
      update: { read: true },
    });

    return jsonOk(mapReport(report, readState));
  } catch (error) {
    return handleApiError(error);
  }
}
