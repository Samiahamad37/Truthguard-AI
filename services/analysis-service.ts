import type { AnalysisRequest, AnalysisResult, HistoryRecord } from "@/types";
import apiClient from "@/services/api-client";

export async function analyzeContent(request: AnalysisRequest): Promise<AnalysisResult> {
  if (request.file) {
    const formData = new FormData();
    formData.append("contentType", request.contentType);
    formData.append("content", request.content);
    formData.append("file", request.file);
    const { data } = await apiClient.post<AnalysisResult>("/analyses", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  }

  const { data } = await apiClient.post<AnalysisResult>("/analyses", {
    contentType: request.contentType,
    content: request.content,
  });
  return data;
}

export async function getAnalysisById(id: string): Promise<AnalysisResult> {
  const { data } = await apiClient.get<AnalysisResult>(`/analyses/${id}`);
  return data;
}

export async function getAnalysisHistory(): Promise<HistoryRecord[]> {
  const { data } = await apiClient.get<HistoryRecord[]>("/analyses");
  return data;
}

export async function searchHistory(query: string): Promise<HistoryRecord[]> {
  const { data } = await apiClient.get<HistoryRecord[]>("/analyses", {
    params: { query },
  });
  return data;
}
