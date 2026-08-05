import type {
  AnalysisResult,
  DashboardStats,
  HistoryRecord,
  Notification,
} from "@/types";

export const mockDashboardStats: DashboardStats = {
  totalAnalyses: 1247,
  trustScoreAverage: 72.4,
  fakeNewsDetected: 89,
  recentActivity: [
    {
      id: "1",
      type: "analysis",
      title: "URL Analysis Completed",
      description: "https://example-news-site.com/breaking-story",
      trustScore: 34,
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
    {
      id: "2",
      type: "analysis",
      title: "Text Analysis Completed",
      description: "According to the World Health Organization, vaccination rates...",
      trustScore: 91,
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    },
    {
      id: "3",
      type: "alert",
      title: "Security Alert",
      description: "New login detected from San Francisco, CA",
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    },
    {
      id: "4",
      type: "update",
      title: "AI Model Updated",
      description: "TruthGuard v2.4 with improved bias detection",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    },
  ],
};

export const mockAnalysisResult: AnalysisResult = {
  id: "analysis-001",
  contentType: "url",
  contentPreview: "https://example-news-site.com/breaking-story",
  trustScore: 34,
  confidenceScore: 87,
  sourceCredibility: 28,
  biasAnalysis: {
    political: 72,
    sensationalism: 85,
    confirmationBias: 68,
    overall: "Strong partisan bias with sensationalist framing",
  },
  manipulationDetection: {
    detected: true,
    techniques: [
      "Cherry-picked statistics",
      "Emotional manipulation",
      "False equivalence",
      "Missing context",
    ],
    severity: "high",
    details:
      "The content employs multiple manipulation techniques including selective data presentation and emotionally charged language designed to bypass critical thinking.",
  },
  factCheckSummary: [
    {
      claim: "Study shows 90% increase in related incidents",
      verdict: "misleading",
      explanation:
        "The cited study reports a 9% increase, not 90%. The article misrepresents the data.",
    },
    {
      claim: "Official government statement confirms the claims",
      verdict: "false",
      explanation:
        "No such official statement exists. The article references an unofficial social media post.",
    },
    {
      claim: "Expert quoted supports the main thesis",
      verdict: "misleading",
      explanation:
        "The expert's quote was taken out of context and actually contradicts the article's conclusion.",
    },
  ],
  emotionalLanguage: {
    score: 78,
    detectedTerms: [
      "shocking",
      "devastating",
      "they don't want you to know",
      "urgent",
      "cover-up",
    ],
    sentiment: "negative",
  },
  evidenceSources: [
    {
      id: "src-1",
      title: "Reuters Fact Check",
      url: "https://reuters.com/fact-check",
      credibility: 95,
      relevance: 92,
      snippet: "Independent verification found multiple inaccuracies in the original claims.",
    },
    {
      id: "src-2",
      title: "Associated Press Investigation",
      url: "https://apnews.com",
      credibility: 94,
      relevance: 88,
      snippet: "AP journalists traced the claim to a misinterpreted preliminary report.",
    },
    {
      id: "src-3",
      title: "Peer-reviewed Journal Article",
      url: "https://nature.com",
      credibility: 98,
      relevance: 75,
      snippet: "Original research data contradicts several key assertions in the article.",
    },
  ],
  aiExplanation:
    "This content exhibits multiple red flags consistent with misinformation. The source domain has a history of publishing unverified claims, and the article uses emotionally manipulative language to drive engagement rather than inform. Key statistical claims are misrepresented, and cited 'experts' have been quoted out of context. We recommend treating this content with significant skepticism and consulting the verified evidence sources listed below.",
  recommendedActions: [
    "Do not share this content without verification",
    "Consult the evidence sources provided for accurate information",
    "Report misleading content to the platform if applicable",
    "Verify claims through official government or academic sources",
    "Be aware of emotional manipulation tactics used in the article",
  ],
  status: "completed",
  createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  completedAt: new Date(Date.now() - 1000 * 60 * 28).toISOString(),
};

export const mockHistoryRecords: HistoryRecord[] = [
  {
    id: "analysis-001",
    date: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    contentType: "url",
    trustScore: 34,
    status: "completed",
    contentPreview: "https://example-news-site.com/breaking-story",
  },
  {
    id: "analysis-002",
    date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    contentType: "text",
    trustScore: 91,
    status: "completed",
    contentPreview: "According to the World Health Organization, vaccination rates...",
  },
  {
    id: "analysis-003",
    date: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    contentType: "image",
    trustScore: 52,
    status: "completed",
    contentPreview: "screenshot_claim.jpg",
  },
  {
    id: "analysis-004",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    contentType: "pdf",
    trustScore: 78,
    status: "completed",
    contentPreview: "research_paper_draft.pdf",
  },
  {
    id: "analysis-005",
    date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    contentType: "video",
    trustScore: 23,
    status: "completed",
    contentPreview: "viral_clip_analysis.mp4",
  },
  {
    id: "analysis-006",
    date: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    contentType: "url",
    trustScore: 67,
    status: "completed",
    contentPreview: "https://trusted-source.org/article",
  },
];

export const mockNotifications: Notification[] = [
  {
    id: "notif-1",
    type: "analysis",
    title: "Analysis Complete",
    message: "Your URL analysis finished with a trust score of 34%",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: "notif-2",
    type: "security",
    title: "New Login Detected",
    message: "A new login was detected from San Francisco, CA on Chrome",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: "notif-3",
    type: "update",
    title: "AI Model v2.4 Released",
    message: "Improved bias detection and multilingual support now available",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "notif-4",
    type: "analysis",
    title: "Batch Analysis Complete",
    message: "5 documents analyzed — 2 flagged as potential misinformation",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
];
