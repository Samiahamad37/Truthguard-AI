export const APP_NAME = "TruthGuard AI";
export const APP_DESCRIPTION =
  "AI-powered misinformation detection platform that helps you verify whether online information is trustworthy.";

export const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
] as const;

export const SIDEBAR_NAV = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Verify Content", href: "/verify", icon: "ShieldCheck" },
  { label: "Analysis History", href: "/history", icon: "History" },
  { label: "Reports", href: "/reports", icon: "FileBarChart" },
  { label: "Notifications", href: "/notifications", icon: "Bell" },
  { label: "Settings", href: "/settings", icon: "Settings" },
] as const;

export const CONTENT_TYPES = [
  { value: "text", label: "Text", icon: "FileText" },
  { value: "url", label: "URL", icon: "Link" },
  { value: "image", label: "Image", icon: "Image" },
  { value: "pdf", label: "PDF", icon: "FileType" },
  { value: "video", label: "Video", icon: "Video" },
] as const;

export const ACCEPTED_FILE_TYPES = {
  image: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  pdf: ["application/pdf"],
  video: ["video/mp4", "video/webm", "video/quicktime"],
} as const;

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
