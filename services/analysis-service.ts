import type { AnalysisRequest, AnalysisResult, HistoryRecord } from "@/types";
import {
  mockAnalysisResult,
  mockHistoryRecords,
} from "@/services/mock-data";

/** Simulates API delay for realistic UX */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function analyzeContent(
  request: AnalysisRequest
): Promise<AnalysisResult> {
  await delay(2000);

  const preview =
    request.contentType === "text"
      ? request.content.slice(0, 100)
      : request.file?.name ?? request.content;

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

export async function getAnalysisById(id: string): Promise<AnalysisResult> {
  await delay(500);
  return { ...mockAnalysisResult, id };
}

export async function getAnalysisHistory(): Promise<HistoryRecord[]> {
  await delay(300);
  return mockHistoryRecords;
}

export async function searchHistory(
  query: string
): Promise<HistoryRecord[]> {
  await delay(200);
  const lower = query.toLowerCase();
  return mockHistoryRecords.filter(
    (r) =>
      r.contentPreview.toLowerCase().includes(lower) ||
      r.contentType.toLowerCase().includes(lower)
  );
}
