import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { handleApiError, jsonError, jsonOk } from "@/lib/api-utils";
import type { AnalysisResult } from "@/types";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await requireAuth(request);
    const { id } = await params;

    const analysis = await prisma.analysis.findFirst({
      where: { id, userId },
    });

    if (!analysis) {
      return jsonError("Analysis not found", 404);
    }

    return jsonOk(analysis.result as unknown as AnalysisResult);
  } catch (error) {
    return handleApiError(error);
  }
}
