import type { DashboardStats } from "@/types";
import apiClient from "@/services/api-client";

export async function getDashboardStats(): Promise<DashboardStats> {
  const { data } = await apiClient.get<DashboardStats>("/dashboard/stats");
  return data;
}
