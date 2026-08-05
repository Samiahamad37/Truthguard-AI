import type {
  AnalysisResult,
  ContentType,
  FactCheckItem,
  TrustLevel,
} from "@/types";
import { getTrustScoreLabel } from "@/lib/utils";

const SENSATIONAL_TERMS = [
  "shocking",
  "devastating",
  "urgent",
  "breaking",
  "exclusive",
  "secret",
  "cover-up",
  "coverup",
  "they don't want you to know",
  "miracle",
  "guaranteed",
  "100%",
  "bombshell",
  "exposed",
  "unbelievable",
  "you won't believe",
  "must read",
  "alert",
  "warning",
  "scandal",
];

const MANIPULATION_PHRASES: { phrase: RegExp | string; technique: string }[] = [
  { phrase: /they don't want you to know/i, technique: "Conspiracy framing" },
  { phrase: /doctors hate|experts hate/i, technique: "False authority attack" },
  { phrase: /100%|guaranteed cure|miracle/i, technique: "Absolute claims" },
  { phrase: /share (this|before|now)|forward this/i, technique: "Viral pressure" },
  { phrase: /mainstream media (won't|doesn't|refuses)/i, technique: "Institutional distrust" },
  { phrase: /big pharma|big tech|deep state/i, technique: "Us-vs-them narrative" },
  { phrase: /\b(shocking|bombshell|exposed)\b/i, technique: "Sensationalist framing" },
  { phrase: /stud(y|ies) (show|prove|confirm)/i, technique: "Unverified research claims" },
  { phrase: /breaking:|just in:/i, technique: "Artificial urgency" },
  { phrase: /[A-Z]{8,}/, technique: "Excessive capitalization" },
];

const TRUSTED_DOMAINS = [
  "who.int",
  "cdc.gov",
  "nih.gov",
  "reuters.com",
  "apnews.com",
  "bbc.com",
  "nature.com",
  "science.org",
  "gov.uk",
  ".edu",
  "wikipedia.org",
  "nytimes.com",
  "theguardian.com",
];

const LOW_CREDIBILITY_DOMAINS = [
  "blogspot",
  "wordpress.com",
  "medium.com/@",
  "facebook.com",
  "twitter.com",
  "x.com",
  "tiktok.com",
  "telegram",
  "beforeitsnews",
  "naturalnews",
];

const TOPIC_SOURCES: Record<string, { title: string; url: string; credibility: number }[]> = {
  health: [
    { title: "World Health Organization", url: "https://www.who.int", credibility: 98 },
    { title: "Centers for Disease Control", url: "https://www.cdc.gov", credibility: 97 },
    { title: "PubMed Research Database", url: "https://pubmed.ncbi.nlm.nih.gov", credibility: 96 },
  ],
  science: [
    { title: "Nature Journal", url: "https://www.nature.com", credibility: 98 },
    { title: "Science Magazine", url: "https://www.science.org", credibility: 97 },
    { title: "Google Scholar", url: "https://scholar.google.com", credibility: 90 },
  ],
  news: [
    { title: "Reuters Fact Check", url: "https://www.reuters.com/fact-check", credibility: 95 },
    { title: "Associated Press", url: "https://apnews.com", credibility: 94 },
    { title: "Snopes", url: "https://www.snopes.com", credibility: 88 },
  ],
  general: [
    { title: "Reuters", url: "https://www.reuters.com", credibility: 95 },
    { title: "Associated Press", url: "https://apnews.com", credibility: 94 },
    { title: "FactCheck.org", url: "https://www.factcheck.org", credibility: 90 },
  ],
};

interface ContentSignals {
  text: string;
  preview: string;
  contentType: ContentType;
  sensationalTerms: string[];
  manipulationTechniques: string[];
  trustedSource: boolean;
  lowCredibilitySource: boolean;
  hasCitations: boolean;
  hasStatistics: boolean;
  topic: keyof typeof TOPIC_SOURCES;
  claims: string[];
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function extractDomain(input: string): string | null {
  try {
    const url = input.startsWith("http") ? input : `https://${input}`;
    return new URL(url).hostname.toLowerCase();
  } catch {
    return null;
  }
}

function detectTopic(text: string): keyof typeof TOPIC_SOURCES {
  const lower = text.toLowerCase();
  if (/vaccin|health|disease|virus|covid|medical|doctor|who|cdc|symptom/.test(lower)) {
    return "health";
  }
  if (/study|research|scientist|data|experiment|peer|journal|climate/.test(lower)) {
    return "science";
  }
  if (/election|government|politic|president|congress|policy|war/.test(lower)) {
    return "news";
  }
  return "general";
}

function extractClaims(text: string): string[] {
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20 && s.length < 220);

  const claimLike = sentences.filter(
    (s) =>
      /\d+%|\d+ (people|cases|deaths|years)|study|research|official|prove|show|confirm|cause|prevent|increase|decrease/i.test(
        s
      )
  );

  return (claimLike.length > 0 ? claimLike : sentences.slice(0, 3)).slice(0, 3);
}

function analyzeContent(
  contentType: ContentType,
  content: string,
  fileName?: string
): ContentSignals {
  const text =
    contentType === "text"
      ? content
      : contentType === "url"
        ? content
        : `${fileName ?? content} ${content}`;

  const preview =
    contentType === "text"
      ? content.slice(0, 120)
      : fileName ?? content.slice(0, 120);

  const lower = text.toLowerCase();
  const sensationalTerms = SENSATIONAL_TERMS.filter((term) => lower.includes(term));

  const manipulationTechniques = MANIPULATION_PHRASES.filter(({ phrase }) =>
    typeof phrase === "string" ? lower.includes(phrase.toLowerCase()) : phrase.test(text)
  ).map(({ technique }) => technique);

  const domain = contentType === "url" ? extractDomain(content) : null;
  const trustedSource = domain
    ? TRUSTED_DOMAINS.some((d) => domain.includes(d.replace(/^\./, "")))
    : /\.gov\b|\.edu\b/i.test(text);

  const lowCredibilitySource = domain
    ? LOW_CREDIBILITY_DOMAINS.some((d) => domain.includes(d))
    : false;

  return {
    text,
    preview,
    contentType,
    sensationalTerms,
    manipulationTechniques: [...new Set(manipulationTechniques)],
    trustedSource,
    lowCredibilitySource,
    hasCitations: /according to|source:|cited|reference|\[\d+\]|doi:/i.test(text),
    hasStatistics: /\d+%|\d+ (million|billion|thousand)|statistics|data shows/i.test(text),
    topic: detectTopic(text),
    claims: extractClaims(text),
  };
}

function computeTrustScore(signals: ContentSignals): number {
  let score = 62;

  if (signals.trustedSource) score += 22;
  if (signals.lowCredibilitySource) score -= 28;
  if (signals.hasCitations) score += 8;
  if (signals.hasStatistics && signals.trustedSource) score += 5;
  if (signals.hasStatistics && !signals.hasCitations && !signals.trustedSource) score -= 6;

  score -= signals.sensationalTerms.length * 5;
  score -= signals.manipulationTechniques.length * 7;

  if (signals.contentType === "url" && !signals.trustedSource && !signals.lowCredibilitySource) {
    score -= 5;
  }
  if (signals.contentType === "image" || signals.contentType === "video") {
    score -= 8;
  }
  if (signals.text.length > 200 && signals.sensationalTerms.length === 0) {
    score += 6;
  }
  if (signals.text.length < 40) {
    score -= 10;
  }

  // Stable variation from content hash so same input = same score
  const hash = signals.text.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  score += (hash % 7) - 3;

  return clamp(Math.round(score), 8, 96);
}

function verdictFromTrust(trustScore: number): FactCheckItem["verdict"] {
  if (trustScore >= 75) return "true";
  if (trustScore >= 55) return "unverified";
  if (trustScore >= 35) return "misleading";
  return "false";
}

function buildFactChecks(signals: ContentSignals, trustScore: number): FactCheckItem[] {
  const verdict = verdictFromTrust(trustScore);

  if (signals.claims.length === 0) {
    return [
      {
        claim: `Core claim in submitted ${signals.contentType}`,
        verdict,
        explanation: buildClaimExplanation(signals, trustScore, signals.preview),
      },
    ];
  }

  return signals.claims.map((claim) => ({
    claim: claim.length > 140 ? `${claim.slice(0, 137)}...` : claim,
    verdict,
    explanation: buildClaimExplanation(signals, trustScore, claim),
  }));
}

function buildClaimExplanation(
  signals: ContentSignals,
  trustScore: number,
  claim: string
): string {
  if (trustScore >= 75) {
    return `This claim aligns with patterns seen in credible ${signals.topic} reporting. No major misrepresentation flags were detected in the submitted content.`;
  }
  if (trustScore >= 55) {
    return `This claim requires independent verification. The submitted content does not provide enough corroboration from established sources to confirm accuracy.`;
  }
  if (signals.sensationalTerms.length > 0) {
    return `The claim "${claim.slice(0, 60)}..." uses sensational language and lacks support from verified ${signals.topic} sources in the content provided.`;
  }
  return `This claim shows signs of misrepresentation or missing context based on language patterns and source signals in the submitted content.`;
}

function buildManipulation(signals: ContentSignals, trustScore: number) {
  const detected =
    signals.manipulationTechniques.length > 0 ||
    signals.sensationalTerms.length >= 2 ||
    trustScore < 45;

  const severity: TrustLevel =
    trustScore < 30 ? "critical" : trustScore < 45 ? "high" : trustScore < 60 ? "medium" : "low";

  let details: string;
  if (!detected) {
    details = `No significant manipulation patterns were detected in the submitted ${signals.contentType} content. Language appears informational rather than designed to bypass critical thinking.`;
  } else if (trustScore < 45) {
    details = `The submitted content "${signals.preview}" shows multiple persuasion patterns${signals.sensationalTerms.length ? ` including emotionally charged terms (${signals.sensationalTerms.slice(0, 3).join(", ")})` : ""}. These techniques are commonly used to increase engagement at the expense of factual accuracy.`;
  } else {
    details = `Some persuasive framing was detected in the content${signals.manipulationTechniques.length ? `: ${signals.manipulationTechniques.join(", ")}` : ""}. Review claims carefully before sharing.`;
  }

  return {
    detected,
    techniques: detected
      ? signals.manipulationTechniques.length > 0
        ? signals.manipulationTechniques
        : ["Emotional language", "Unverified assertions"]
      : [],
    severity,
    details,
  };
}

function buildEvidenceSources(signals: ContentSignals, trustScore: number) {
  const sources = TOPIC_SOURCES[signals.topic];
  const snippetPrefix =
    trustScore < 45
      ? "Use this source to verify disputed claims found in your submission"
      : "Cross-reference factual details from your submission against this established source";

  return sources.map((source, i) => ({
    id: `src-${i + 1}`,
    title: source.title,
    url: source.url,
    credibility: source.credibility,
    relevance: clamp(95 - i * 4 - (trustScore < 50 ? 0 : 5), 70, 98),
    snippet: `${snippetPrefix}: "${signals.preview.slice(0, 80)}${signals.preview.length > 80 ? "..." : ""}"`,
  }));
}

function buildAiExplanation(signals: ContentSignals, trustScore: number): string {
  const label = getTrustScoreLabel(trustScore);
  const preview = signals.preview;

  if (trustScore >= 80) {
    return `TruthGuard rated this ${signals.contentType} content at ${trustScore}% (${label}). The submission "${preview}" shows characteristics of credible information${signals.trustedSource ? " from a generally trusted source" : ""}${signals.hasCitations ? " with attribution patterns" : ""}. No major manipulation or sensationalism flags were detected.`;
  }
  if (trustScore >= 60) {
    return `TruthGuard rated this content at ${trustScore}% (${label}). While "${preview}" does not show severe misinformation signals, some claims should be verified against independent ${signals.topic} sources before you rely on or share them.`;
  }
  if (trustScore >= 40) {
    return `TruthGuard rated this content at ${trustScore}% (${label}). The submission "${preview}" contains questionable elements${signals.sensationalTerms.length ? ` such as sensational phrasing (${signals.sensationalTerms.slice(0, 2).join(", ")})` : ""}. Treat key claims as unverified until confirmed by authoritative evidence.`;
  }
  return `TruthGuard rated this content at ${trustScore}% (${label}). The submission "${preview}" exhibits multiple misinformation indicators${signals.manipulationTechniques.length ? ` including ${signals.manipulationTechniques.slice(0, 2).join(" and ")}` : ""}${signals.lowCredibilitySource ? " from a low-credibility source type" : ""}. We strongly recommend skepticism and independent fact-checking.`;
}

function buildRecommendedActions(signals: ContentSignals, trustScore: number): string[] {
  if (trustScore >= 80) {
    return [
      "Content appears trustworthy — still verify critical facts before widespread sharing",
      signals.hasCitations
        ? "Follow the cited sources to confirm the original context"
        : "Add citations to primary sources when sharing this information",
      "Share with attribution to the original publisher or author",
      `Cross-check key details with ${TOPIC_SOURCES[signals.topic][0].title}`,
    ];
  }
  if (trustScore >= 60) {
    return [
      "Verify the main claims using at least two independent reputable sources",
      `Compare this ${signals.contentType} against coverage from ${TOPIC_SOURCES[signals.topic][0].title}`,
      "Avoid sharing until uncertain claims are confirmed",
      signals.sensationalTerms.length
        ? "Be cautious of sensational phrasing that may oversimplify complex topics"
        : "Look for primary data or official statements supporting the claims",
    ];
  }
  if (trustScore >= 40) {
    return [
      "Do not share this content until claims are independently verified",
      `Consult the evidence sources listed — especially ${TOPIC_SOURCES[signals.topic][0].title}`,
      "Watch for emotionally charged language designed to bypass critical thinking",
      "Report misleading content to the platform if it poses public harm",
    ];
  }
  return [
    "Do not share this content — high risk of misinformation",
    `Verify every claim through official ${signals.topic} authorities before believing or forwarding`,
    "Be aware of manipulation tactics detected in the submitted material",
    "Inform others who may have received this content that it is unreliable",
    "Use the evidence sources below to find accurate information on the same topic",
  ];
}

function buildBiasAnalysis(signals: ContentSignals, trustScore: number) {
  const sensationalism = clamp(
    20 + signals.sensationalTerms.length * 15 + (trustScore < 50 ? 20 : 0),
    10,
    95
  );
  const political = clamp(
    /election|politic|party|government|left|right|liberal|conservative/i.test(signals.text)
      ? 55 + (100 - trustScore) / 2
      : 15 + (100 - trustScore) / 4,
    10,
    90
  );
  const confirmationBias = clamp(
    25 + signals.manipulationTechniques.length * 10 + (trustScore < 45 ? 25 : 0),
    10,
    90
  );

  let overall: string;
  if (trustScore >= 75) {
    overall = "Minimal bias detected — content appears relatively neutral and fact-oriented";
  } else if (trustScore >= 55) {
    overall = "Moderate framing bias — some subjective or persuasive language present";
  } else if (sensationalism > 60) {
    overall = "Strong sensationalist framing with language that may distort factual context";
  } else {
    overall = "Significant bias indicators — content shows partisan or manipulative framing patterns";
  }

  return { political, sensationalism, confirmationBias, overall };
}

function buildEmotionalLanguage(signals: ContentSignals, trustScore: number) {
  const score = clamp(
    signals.sensationalTerms.length * 18 +
      (trustScore < 40 ? 25 : trustScore < 60 ? 12 : 0) +
      (signals.manipulationTechniques.length > 0 ? 15 : 0),
    5,
    95
  );

  let sentiment: "positive" | "negative" | "neutral" | "mixed" = "neutral";
  if (/fear|danger|death|crisis|attack|destroy|threat/i.test(signals.text)) sentiment = "negative";
  else if (/hope|success|breakthrough|win|safe|effective/i.test(signals.text)) sentiment = "positive";
  else if (score > 40) sentiment = "mixed";

  return {
    score,
    detectedTerms:
      signals.sensationalTerms.length > 0
        ? signals.sensationalTerms.slice(0, 6)
        : score > 30
          ? ["persuasive tone"]
          : [],
    sentiment,
  };
}

export function buildAnalysisResult(input: {
  contentType: ContentType;
  content: string;
  fileName?: string;
}): AnalysisResult {
  const signals = analyzeContent(input.contentType, input.content, input.fileName);
  const trustScore = computeTrustScore(signals);

  const sourceCredibility = clamp(
    (signals.trustedSource ? 85 : signals.lowCredibilitySource ? 22 : 48) +
      (trustScore - 50) / 2,
    12,
    96
  );

  const confidenceScore = clamp(
    70 +
      (signals.text.length > 80 ? 10 : -10) +
      (signals.claims.length > 0 ? 8 : -5) -
      (signals.contentType === "image" || signals.contentType === "video" ? 12 : 0),
    55,
    95
  );

  return {
    id: `analysis-${Date.now()}`,
    contentType: input.contentType,
    contentPreview: signals.preview,
    trustScore,
    confidenceScore,
    sourceCredibility: Math.round(sourceCredibility),
    biasAnalysis: buildBiasAnalysis(signals, trustScore),
    manipulationDetection: buildManipulation(signals, trustScore),
    factCheckSummary: buildFactChecks(signals, trustScore),
    emotionalLanguage: buildEmotionalLanguage(signals, trustScore),
    evidenceSources: buildEvidenceSources(signals, trustScore),
    aiExplanation: buildAiExplanation(signals, trustScore),
    recommendedActions: buildRecommendedActions(signals, trustScore),
    status: "completed",
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
