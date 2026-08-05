import { cn, getTrustScoreBadgeVariant, getTrustScoreColor, getTrustScoreLabel } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const TRUST_TIERS = [
  { min: 80, color: "bg-emerald-500", label: "Highly Trustworthy" },
  { min: 60, color: "bg-blue-500", label: "Mostly Reliable" },
  { min: 40, color: "bg-amber-500", label: "Questionable" },
  { min: 0, color: "bg-red-500", label: "Likely Misinformation" },
] as const;

export function TrustScoreLegend({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-xl border border-slate-100 p-4 dark:border-slate-800", className)}>
      <p className="mb-3 text-sm font-medium text-slate-900 dark:text-white">
        Trust Score Guide
      </p>
      <div className="space-y-2">
        {TRUST_TIERS.map((tier) => (
          <div key={tier.label} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
            <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", tier.color)} />
            <span>
              {tier.min === 80 ? "Green (80%+)" : tier.min === 60 ? "Blue (60–79%)" : tier.min === 40 ? "Amber (40–59%)" : "Red (<40%)"}
              {" — "}
              <span className="font-medium text-slate-700 dark:text-slate-300">{tier.label}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TrustScoreBadge({ score, className }: { score: number; className?: string }) {
  return (
    <Badge variant={getTrustScoreBadgeVariant(score)} className={className}>
      <span className={cn("font-bold", getTrustScoreColor(score))}>{score}%</span>
      <span className="mx-1 opacity-50">·</span>
      {getTrustScoreLabel(score)}
    </Badge>
  );
}
