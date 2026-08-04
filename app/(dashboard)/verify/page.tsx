"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FileText,
  Link as LinkIcon,
  Image,
  FileType,
  Video,
  Sparkles,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadZone } from "@/components/ui/upload-zone";
import { LoadingOverlay } from "@/components/ui/loading-spinner";
import { Alert } from "@/components/ui/alert";
import { useAnalysis } from "@/hooks/use-analysis";
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE } from "@/utils/constants";
import type { ContentType } from "@/types";
import { cn } from "@/lib/utils";

const contentTabs = [
  { value: "text", label: "Text", icon: FileText },
  { value: "url", label: "URL", icon: LinkIcon },
  { value: "image", label: "Image", icon: Image },
  { value: "pdf", label: "PDF", icon: FileType },
  { value: "video", label: "Video", icon: Video },
] as const;

export default function VerifyPage() {
  const router = useRouter();
  const { analyze, isLoading, error } = useAnalysis();
  const [activeTab, setActiveTab] = useState<ContentType>("text");
  const [textContent, setTextContent] = useState("");
  const [urlContent, setUrlContent] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleAnalyze = async () => {
    let content = "";
    let file: File | undefined;

    switch (activeTab) {
      case "text":
        if (!textContent.trim()) return;
        content = textContent;
        break;
      case "url":
        if (!urlContent.trim()) return;
        content = urlContent;
        break;
      default:
        if (uploadedFiles.length === 0) return;
        file = uploadedFiles[0];
        content = file.name;
        break;
    }

    const result = await analyze({
      contentType: activeTab,
      content,
      file,
    });

    if (result) {
      router.push(`/results/${result.id}`);
    }
  };

  const getAcceptTypes = (): string[] => {
    switch (activeTab) {
      case "image":
        return [...ACCEPTED_FILE_TYPES.image];
      case "pdf":
        return [...ACCEPTED_FILE_TYPES.pdf];
      case "video":
        return [...ACCEPTED_FILE_TYPES.video];
      default:
        return [];
    }
  };

  const isAnalyzeDisabled = () => {
    if (activeTab === "text") return !textContent.trim();
    if (activeTab === "url") return !urlContent.trim();
    return uploadedFiles.length === 0;
  };

  return (
    <DashboardShell
      title="Verify Content"
      description="Submit content for AI-powered misinformation analysis"
    >
      {isLoading && <LoadingOverlay />}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <Card>
          <CardHeader>
            <CardTitle>Analyze Content</CardTitle>
            <CardDescription>
              Choose a content type and submit for verification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as ContentType)}
            >
              <TabsList className="w-full grid grid-cols-5 mb-6">
                {contentTabs.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value} className="gap-1.5">
                    <tab.icon className="h-4 w-4 hidden sm:block" />
                    <span className="text-xs sm:text-sm">{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="text" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="text-content">Paste text content</Label>
                  <Textarea
                    id="text-content"
                    placeholder="Paste the text you want to verify here..."
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    className="min-h-[200px]"
                  />
                  <p className="text-xs text-slate-400">
                    {textContent.length} characters
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="url" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="url-content">Website URL</Label>
                  <Input
                    id="url-content"
                    type="url"
                    placeholder="https://example.com/article"
                    value={urlContent}
                    onChange={(e) => setUrlContent(e.target.value)}
                  />
                </div>
              </TabsContent>

              {(["image", "pdf", "video"] as const).map((type) => (
                <TabsContent key={type} value={type}>
                  <UploadZone
                    accept={getAcceptTypes()}
                    maxSize={MAX_FILE_SIZE}
                    onFilesChange={setUploadedFiles}
                    label={`Drag & drop your ${type.toUpperCase()} here`}
                    description={`Supports ${type === "image" ? "JPEG, PNG, WebP, GIF" : type === "pdf" ? "PDF documents" : "MP4, WebM, MOV"} up to 50MB`}
                  />
                </TabsContent>
              ))}
            </Tabs>

            {error && (
              <Alert variant="error" title="Analysis Failed" className="mt-4">
                {error}
              </Alert>
            )}

            <div className="mt-6 flex justify-end">
              <Button
                size="lg"
                onClick={handleAnalyze}
                disabled={isAnalyzeDisabled() || isLoading}
                className={cn("gap-2")}
              >
                <Sparkles className="h-4 w-4" />
                Analyze with AI
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </DashboardShell>
  );
}
