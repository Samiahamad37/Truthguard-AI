import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { handleApiError, jsonOk } from "@/lib/api-utils";
import { mockDashboardStats } from "@/services/mock-data";
import type { DashboardStats } from "@/types";

export async function GET(request: Request) {
  try {
    const userId = await requireAuth(request);

    const analyses = await prisma.analysis.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    const totalAnalyses = await prisma.analysis.count({ where: { userId } });
    const fakeNewsDetected = await prisma.analysis.count({
      where: { userId, trustScore: { lt: 40 } },
    });

    const allForAvg = await prisma.analysis.aggregate({
      where: { userId },
      _avg: { trustScore: true },
    });

    const stats: DashboardStats = {
      totalAnalyses,
      trustScoreAverage: Number((allForAvg._avg.trustScore ?? mockDashboardStats.trustScoreAverage).toFixed(1)),
      fakeNewsDetected,
      recentActivity:
        analyses.length > 0
          ? analyses.slice(0, 4).map((a) => ({
              id: a.id,
              type: "analysis" as const,
              title: `${a.contentType.toUpperCase()} Analysis Completed`,
              description: a.contentPreview,
              trustScore: a.trustScore,
              timestamp: a.createdAt.toISOString(),
            }))
          : mockDashboardStats.recentActivity,
    };

    return jsonOk(stats);
  } catch (error) {
    return handleApiError(error);
  }
}
