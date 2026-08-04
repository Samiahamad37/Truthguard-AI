export type ContentType = "text" | "url" | "image" | "pdf" | "video";

export type AnalysisStatus = "pending" | "processing" | "completed" | "failed";

export type TrustLevel = "high" | "medium" | "low" | "critical";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export interface AnalysisRequest {
  contentType: ContentType;
  content: string;
  file?: File;
}

export interface BiasAnalysis {
  political: number;
  sensationalism: number;
  confirmationBias: number;
  overall: string;
}

export interface ManipulationDetection {
  detected: boolean;
  techniques: string[];
  severity: TrustLevel;
  details: string;
}

export interface EvidenceSource {
  id: string;
  title: string;
  url: string;
  credibility: number;
  relevance: number;
  snippet: string;
}

export interface FactCheckItem {
  claim: string;
  verdict: "true" | "false" | "misleading" | "unverified";
  explanation: string;
}

export interface AnalysisResult {
  id: string;
  contentType: ContentType;
  contentPreview: string;
  trustScore: number;
  confidenceScore: number;
  sourceCredibility: number;
  biasAnalysis: BiasAnalysis;
  manipulationDetection: ManipulationDetection;
  factCheckSummary: FactCheckItem[];
  emotionalLanguage: {
    score: number;
    detectedTerms: string[];
    sentiment: "positive" | "negative" | "neutral" | "mixed";
  };
  evidenceSources: EvidenceSource[];
  aiExplanation: string;
  recommendedActions: string[];
  status: AnalysisStatus;
  createdAt: string;
  completedAt?: string;
}

export interface DashboardStats {
  totalAnalyses: number;
  trustScoreAverage: number;
  fakeNewsDetected: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: "analysis" | "alert" | "update";
  title: string;
  description: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  type: "analysis" | "security" | "update";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface HistoryRecord {
  id: string;
  date: string;
  contentType: ContentType;
  trustScore: number;
  status: AnalysisStatus;
  contentPreview: string;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed?: string;
}
