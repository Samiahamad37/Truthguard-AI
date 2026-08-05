import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function getTrustScoreColor(score: number): string {
  if (score >= 80) return "text-emerald-500";
  if (score >= 60) return "text-blue-500";
  if (score >= 40) return "text-amber-500";
  return "text-red-500";
}

export function getTrustScoreLabel(score: number): string {
  if (score >= 80) return "Highly Trustworthy";
  if (score >= 60) return "Mostly Reliable";
  if (score >= 40) return "Questionable";
  return "Likely Misinformation";
}

export function getTrustScoreBadgeVariant(
  score: number
): "success" | "info" | "warning" | "danger" {
  if (score >= 80) return "success";
  if (score >= 60) return "info";
  if (score >= 40) return "warning";
  return "danger";
}

export function getTrustScoreDescription(score: number): string {
  if (score >= 80) {
    return "This content shows strong indicators of reliability and aligns with credible source patterns.";
  }
  if (score >= 60) {
    return "This content is mostly reliable, but some claims should be verified before sharing.";
  }
  if (score >= 40) {
    return "This content has questionable elements and requires careful fact-checking.";
  }
  return "This content shows strong misinformation signals and should not be trusted without verification.";
}

export function getTrustScoreProgressColor(score: number): string {
  if (score >= 80) return "stroke-emerald-500";
  if (score >= 60) return "stroke-blue-500";
  if (score >= 40) return "stroke-amber-500";
  return "stroke-red-500";
}
