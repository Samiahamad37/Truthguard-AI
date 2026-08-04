"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FeaturesSection } from "@/features/landing/features-section";
import { HowItWorksSection } from "@/features/landing/how-it-works-section";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-950 dark:to-blue-950/20">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-blue-400/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-blue-600/5 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-4 py-1.5 text-sm text-blue-700 backdrop-blur-sm dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-300 mb-6">
                <Sparkles className="h-4 w-4" />
                AI-Powered Misinformation Detection
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl leading-tight">
                Verify Information{" "}
                <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  Before You Believe It
                </span>
              </h1>

              <p className="mt-6 text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg">
                TruthGuard AI analyzes text, URLs, images, and videos to detect
                misinformation, bias, and manipulation — giving you the confidence
                to make informed decisions.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <Button size="lg" className="w-full sm:w-auto">
                    Start Verifying Free
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#how-it-works">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    See How It Works
                  </Button>
                </Link>
              </div>

              <div className="mt-10 flex items-center gap-6 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span>99.2% accuracy</span>
                </div>
                <div className="h-4 w-px bg-slate-300 dark:bg-slate-700" />
                <span>1M+ analyses completed</span>
                <div className="h-4 w-px bg-slate-300 dark:bg-slate-700" />
                <span>Free tier available</span>
              </div>
            </motion.div>

            {/* AI Illustration Placeholder */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-3xl border border-slate-200/60 bg-white/60 p-8 backdrop-blur-xl shadow-2xl shadow-blue-100/50 dark:border-slate-700/60 dark:bg-slate-900/60 dark:shadow-blue-900/20">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-600 shadow-xl shadow-blue-600/40">
                      <Shield className="h-10 w-10 text-white" />
                    </div>
                    <div className="space-y-3">
                      <div className="h-3 w-48 mx-auto rounded-full bg-blue-200 dark:bg-blue-800" />
                      <div className="h-3 w-36 mx-auto rounded-full bg-blue-150 dark:bg-blue-850 opacity-70" />
                      <div className="mt-6 grid grid-cols-3 gap-3">
                        {[72, 45, 91].map((score, i) => (
                          <div
                            key={i}
                            className="rounded-xl bg-white/80 dark:bg-slate-800/80 p-3 shadow-sm"
                          >
                            <div className="text-lg font-bold text-blue-600">{score}%</div>
                            <div className="text-xs text-slate-500">Trust</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 rounded-xl bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
                  ✓ Verified
                </div>
                <div className="absolute -bottom-4 -left-4 rounded-xl bg-red-500 px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
                  ✗ Flagged
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <FeaturesSection />
      <HowItWorksSection />

      {/* CTA Section */}
      <section id="pricing" className="py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl bg-gradient-to-r from-blue-600 to-blue-700 p-12 text-center shadow-2xl shadow-blue-600/30"
          >
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Ready to fight misinformation?
            </h2>
            <p className="mt-4 text-lg text-blue-100 max-w-xl mx-auto">
              Join thousands of users who trust TruthGuard AI to verify information
              before sharing it.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto bg-white text-blue-700 hover:bg-blue-50"
                >
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
