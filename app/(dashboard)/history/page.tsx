"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Eye, FileText, Link as LinkIcon, Image, FileType, Video } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { useHistory } from "@/hooks/use-history";
import { cn, formatDate, getTrustScoreColor } from "@/lib/utils";
import type { ContentType } from "@/types";

const typeIcons: Record<ContentType, React.ElementType> = {
  text: FileText,
  url: LinkIcon,
  image: Image,
  pdf: FileType,
  video: Video,
};

export default function HistoryPage() {
  const { records, isLoading, searchQuery, setSearchQuery } = useHistory();

  return (
    <DashboardShell
      title="Analysis History"
      description="Search and review your past content analyses"
    >
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search by content or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner label="Loading history..." />
        </div>
      ) : records.length === 0 ? (
        <EmptyState
          title="No analyses found"
          description={
            searchQuery
              ? "Try adjusting your search terms"
              : "Start by verifying your first piece of content"
          }
          action={
            !searchQuery ? (
              <Link href="/verify">
                <Button>Verify Content</Button>
              </Link>
            ) : undefined
          }
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Content Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Preview
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Trust Score
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {records.map((record, index) => {
                    const TypeIcon = typeIcons[record.contentType];
                    return (
                      <motion.tr
                        key={record.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
                          {formatDate(record.date)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <TypeIcon className="h-4 w-4 text-slate-400" />
                            <span className="text-sm capitalize text-slate-700 dark:text-slate-300">
                              {record.contentType}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 max-w-xs truncate">
                          {record.contentPreview}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={cn(
                              "text-sm font-bold",
                              getTrustScoreColor(record.trustScore)
                            )}
                          >
                            {record.trustScore}%
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            variant={
                              record.status === "completed"
                                ? "success"
                                : record.status === "failed"
                                  ? "danger"
                                  : "warning"
                            }
                            className="capitalize"
                          >
                            {record.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link href={`/results/${record.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                              View Details
                            </Button>
                          </Link>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </DashboardShell>
  );
}
