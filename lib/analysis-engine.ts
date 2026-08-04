import type { AnalysisRequest, AnalysisResult, ContentType } from "@/types";
import { mockAnalysisResult } from "@/services/mock-data";

export function buildAnalysisResult(
  request: Pick<AnalysisRequest, "contentType" | "content"> & { fileName?: string }
): AnalysisResult {
  const preview =
    request.contentType === "text"
      ? request.content.slice(0, 100)
      : request.fileName ?? request.content;

  return {
    ...mockAnalysisResult,
    id: `analysis-${Date.now()}`,
    contentType: request.contentType,
    contentPreview: preview,
    trustScore: Math.floor(Math.random() * 40) + 30,
    createdAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
  };
}

export function parseAnalysisRequest(formData: FormData): {
  contentType: ContentType;
  content: string;
  fileName?: string;
} | null {
  const contentType = formData.get("contentType") as ContentType | null;
  const content = formData.get("content");

  if (!contentType || typeof content !== "string") {
    return null;
  }

  const file = formData.get("file");
  const fileName = file instanceof File ? file.name : undefined;

  return { contentType, content, fileName };
}

export function parseAnalysisRequestJson(body: unknown): {
  contentType: ContentType;
  content: string;
} | null {
  if (
    typeof body !== "object" ||
    body === null ||
    !("contentType" in body) ||
    !("content" in body)
  ) {
    return null;
  }

  const { contentType, content } = body as { contentType: ContentType; content: string };
  if (typeof contentType !== "string" || typeof content !== "string") {
    return null;
  }

  return { contentType, content };
}
