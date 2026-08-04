import { ForgotPasswordForm } from "@/features/auth/forgot-password-form";
import Link from "next/link";
import { Shield } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-white dark:from-slate-950 dark:via-blue-950/20 dark:to-slate-950 p-4">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
          <Shield className="h-4 w-4 text-white" />
        </div>
        <span className="font-bold text-slate-900 dark:text-white">TruthGuard AI</span>
      </Link>
      <ForgotPasswordForm />
    </div>
  );
}
