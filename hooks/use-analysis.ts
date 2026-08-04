"use client";

import { useState, useCallback } from "react";
import type { AnalysisRequest, AnalysisResult } from "@/types";
import { analyzeContent } from "@/services/analysis-service";

interface UseAnalysisReturn {
  result: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
  analyze: (request: AnalysisRequest) => Promise<AnalysisResult | null>;
  reset: () => void;
}

export function useAnalysis(): UseAnalysisReturn {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async (request: AnalysisRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await analyzeContent(request);
      setResult(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Analysis failed";
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { result, isLoading, error, analyze, reset };
}
