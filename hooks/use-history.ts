"use client";

import { useState, useEffect, useCallback } from "react";
import type { HistoryRecord } from "@/types";
import { getAnalysisHistory, searchHistory } from "@/services/analysis-service";

export function useHistory() {
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = searchQuery
        ? await searchHistory(searchQuery)
        : await getAnalysisHistory();
      setRecords(data);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return { records, isLoading, searchQuery, setSearchQuery, refetch: fetchHistory };
}
