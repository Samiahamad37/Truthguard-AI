import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  buildAnalysisResult,
  parseAnalysisRequest,
  parseAnalysisRequestJson,
} from "@/lib/analysis-engine";
import { handleApiError, jsonError, jsonOk } from "@/lib/api-utils";
import type { AnalysisResult, ContentType, HistoryRecord } from "@/types";

function toHistoryRecord(analysis: {
  id: string;
  createdAt: Date;
  contentType: string;
  trustScore: number;
  status: string;
  contentPreview: string;
}): HistoryRecord {
  return {
    id: analysis.id,
    date: analysis.createdAt.toISOString(),
    contentType: analysis.contentType as ContentType,
    trustScore: analysis.trustScore,
    status: analysis.status as HistoryRecord["status"],
    contentPreview: analysis.contentPreview,
  };
}

export async function GET(request: Request) {
  try {
    const userId = await requireAuth(request);
    const query = new URL(request.url).searchParams.get("query")?.trim();

    const analyses = await prisma.analysis.findMany({
      where: {
        userId,
        ...(query
          ? {
              OR: [
                { contentPreview: { contains: query, mode: "insensitive" } },
                { contentType: { contains: query, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    return jsonOk(analyses.map(toHistoryRecord));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const userId = await requireAuth(request);
    const contentType = request.headers.get("content-type") ?? "";

    let parsed:
      | { contentType: ContentType; content: string; fileName?: string }
      | null = null;

    if (contentType.includes("multipart/form-data")) {
      parsed = parseAnalysisRequest(await request.formData());
    } else {
      const body = await request.json().catch(() => null);
      parsed = parseAnalysisRequestJson(body);
    }

    if (!parsed) {
      return jsonError("Invalid analysis request");
    }

    const result: AnalysisResult = buildAnalysisResult(parsed);

    const saved = await prisma.analysis.create({
      data: {
        id: result.id,
        userId,
        contentType: result.contentType,
        contentPreview: result.contentPreview,
        trustScore: result.trustScore,
        status: result.status,
        result: result as object,
        completedAt: result.completedAt ? new Date(result.completedAt) : null,
      },
    });

    await prisma.notification.create({
      data: {
        userId,
        type: "analysis",
        title: "Analysis Complete",
        message: `Your ${result.contentType} analysis finished with a trust score of ${result.trustScore}%`,
      },
    });

    return jsonOk({ ...(saved.result as unknown as AnalysisResult), id: saved.id }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
