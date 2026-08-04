"use client";

import { cn } from "@/lib/utils";
import { Upload, X, FileIcon } from "lucide-react";
import { useFileUpload } from "@/hooks/use-file-upload";
import { Button } from "@/components/ui/button";

interface UploadZoneProps {
  accept?: string[];
  maxSize?: number;
  onFilesChange?: (files: File[]) => void;
  className?: string;
  label?: string;
  description?: string;
}

export function UploadZone({
  accept = [],
  maxSize,
  onFilesChange,
  className,
  label = "Drag & drop files here",
  description = "or click to browse",
}: UploadZoneProps) {
  const {
    files,
    error,
    isDragging,
    addFiles,
    removeFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  } = useFileUpload({ accept, maxSize });

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(e.target.files);
      onFilesChange?.(Array.from(e.target.files));
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={(e) => {
          handleDrop(e);
          if (e.dataTransfer.files) {
            onFilesChange?.(Array.from(e.dataTransfer.files));
          }
        }}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 transition-all duration-200 cursor-pointer",
          isDragging
            ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/30"
            : "border-slate-200 hover:border-blue-300 hover:bg-slate-50/50 dark:border-slate-700 dark:hover:border-blue-700 dark:hover:bg-slate-800/30"
        )}
      >
        <input
          type="file"
          accept={accept.join(",")}
          onChange={handleFileInput}
          className="absolute inset-0 cursor-pointer opacity-0"
          aria-label="Upload file"
        />
        <div className="mb-3 rounded-full bg-blue-100 p-3 dark:bg-blue-900/50">
          <Upload className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{description}</p>
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}

      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white/80 px-3 py-2 dark:border-slate-700 dark:bg-slate-900/80"
            >
              <FileIcon className="h-4 w-4 text-slate-400 shrink-0" />
              <span className="flex-1 truncate text-sm text-slate-700 dark:text-slate-300">
                {file.name}
              </span>
              <span className="text-xs text-slate-400">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => removeFile(index)}
                aria-label={`Remove ${file.name}`}
              >
                <X className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
