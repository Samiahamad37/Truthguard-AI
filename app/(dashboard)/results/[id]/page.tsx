"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CircularProgress } from "@/components/ui/circular-progress";
import { Progress } from "@/components/ui/progress";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { BiasRadarChart } from "@/components/charts/dashboard-charts";
import { getAnalysisById } from "@/services/analysis-service";
import {
  formatDate,
  getTrustScoreBadgeVariant,
  getTrustScoreLabel,
} from "@/lib/utils";
import type { AnalysisResult } from "@/types";

function ExpandableSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Card>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-6 text-left"
        aria-expanded={isOpen}
      >
        <CardTitle className="text-base">{title}</CardTitle>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-slate-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-slate-400" />
        )}
      </button>
      {isOpen && <CardContent className="pt-0 pb-6">{children}</CardContent>}
    </Card>
  );
}

const verdictIcons = {
  true: CheckCircle2,
  false: XCircle,
  misleading: AlertTriangle,
  unverified: HelpCircle,
};

const verdictColors = {
  true: "success" as const,
  false: "danger" as const,
  misleading: "warning" as const,
  unverified: "secondary" as const,
};

export default function ResultsPage() {
  const params = useParams();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAnalysisById(params.id as string).then((data) => {
      setResult(data);
      setIsLoading(false);
    });
  }, [params.id]);

  if (isLoading) {
    return (
      <DashboardShell title="Analysis Results">
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" label="Loading results..." />
        </div>
      </DashboardShell>
    );
  }

  if (!result) {
    return (
      <DashboardShell title="Analysis Results">
        <p className="text-center text-slate-500 py-20">Results not found.</p>
      </DashboardShell>
    );
  }

  const biasData = [
    { label: "Political Bias", value: result.biasAnalysis.political },
    { label: "Sensationalism", value: result.biasAnalysis.sensationalism },
    { label: "Confirmation Bias", value: result.biasAnalysis.confirmationBias },
  ];

  return (
    <DashboardShell
      title="Analysis Results"
      description={`Analysis completed ${formatDate(result.completedAt ?? result.createdAt)}`}
      action={
        <Link href="/verify">
          <Button variant="secondary">
            <ArrowLeft className="h-4 w-4" />
            New Analysis
          </Button>
        </Link>
      }
    >
      {/* Trust Score Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Card className="overflow-hidden">
          <div className="grid md:grid-cols-3 gap-6 p-8">
            <div className="flex flex-col items-center justify-center">
              <CircularProgress
                value={result.trustScore}
                size={140}
                label="Trust Score"
              />
              <Badge
                variant={getTrustScoreBadgeVariant(result.trustScore)}
                className="mt-4"
              >
                {getTrustScoreLabel(result.trustScore)}
              </Badge>
            </div>

            <div className="md:col-span-2 space-y-4">
              <div>
                <p className="text-sm text-slate-500 mb-1">Content Analyzed</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                  {result.contentPreview}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500 mb-2">Source Credibility</p>
                  <div className="flex items-center gap-3">
                    <Progress value={result.sourceCredibility} className="flex-1" />
                    <span className="text-sm font-bold">{result.sourceCredibility}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-2">Confidence Score</p>
                  <div className="flex items-center gap-3">
                    <Progress
                      value={result.confidenceScore}
                      className="flex-1"
                      indicatorClassName="bg-emerald-600"
                    />
                    <span className="text-sm font-bold">{result.confidenceScore}%</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{result.contentType.toUpperCase()}</Badge>
                <Badge variant={result.manipulationDetection.detected ? "danger" : "success"}>
                  {result.manipulationDetection.detected
                    ? "Manipulation Detected"
                    : "No Manipulation"}
                </Badge>
                <Badge variant="info">
                  Sentiment: {result.emotionalLanguage.sentiment}
                </Badge>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Bias Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Bias Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <BiasRadarChart data={biasData} />
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
              {result.biasAnalysis.overall}
            </p>
          </CardContent>
        </Card>

        {/* Emotional Language */}
        <Card>
          <CardHeader>
            <CardTitle>Emotional Language Detection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-500">Emotional Intensity</span>
                <span className="font-bold">{result.emotionalLanguage.score}%</span>
              </div>
              <Progress
                value={result.emotionalLanguage.score}
                indicatorClassName="bg-amber-500"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {result.emotionalLanguage.detectedTerms.map((term) => (
                <Badge key={term} variant="warning">
                  {term}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Expandable Sections */}
      <div className="mt-6 space-y-4">
        <ExpandableSection title="Fact Check Summary" defaultOpen>
          <div className="space-y-4">
            {result.factCheckSummary.map((item, i) => {
              const Icon = verdictIcons[item.verdict];
              return (
                <div
                  key={i}
                  className="flex gap-3 rounded-xl border border-slate-100 p-4 dark:border-slate-800"
                >
                  <Icon className="h-5 w-5 shrink-0 mt-0.5 text-slate-400" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {item.claim}
                      </p>
                      <Badge variant={verdictColors[item.verdict]} className="capitalize">
                        {item.verdict}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-500">{item.explanation}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </ExpandableSection>

        <ExpandableSection title="Manipulation Detection">
          {result.manipulationDetection.detected ? (
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                {result.manipulationDetection.details}
              </p>
              <div className="flex flex-wrap gap-2">
                {result.manipulationDetection.techniques.map((technique) => (
                  <Badge key={technique} variant="danger">
                    {technique}
                  </Badge>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">No manipulation techniques detected.</p>
          )}
        </ExpandableSection>

        <ExpandableSection title="Evidence Sources">
          <div className="space-y-3">
            {result.evidenceSources.map((source) => (
              <div
                key={source.id}
                className="flex items-start gap-3 rounded-xl border border-slate-100 p-4 dark:border-slate-800"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {source.title}
                    </p>
                    <Badge variant="success">{source.credibility}% credible</Badge>
                  </div>
                  <p className="text-sm text-slate-500 mb-2">{source.snippet}</p>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline dark:text-blue-400"
                  >
                    View source
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </ExpandableSection>

        <ExpandableSection title="AI Explanation" defaultOpen>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {result.aiExplanation}
          </p>
        </ExpandableSection>

        <ExpandableSection title="Recommended Actions">
          <ul className="space-y-2">
            {result.recommendedActions.map((action, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                {action}
              </li>
            ))}
          </ul>
        </ExpandableSection>
      </div>
    </DashboardShell>
  );
}
