"use client";

import { motion } from "framer-motion";
import {
  Shield,
  Brain,
  Search,
  BarChart3,
  Globe,
  Zap,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description:
      "Advanced machine learning models analyze content for misinformation patterns, bias, and manipulation tactics.",
  },
  {
    icon: Search,
    title: "Multi-Source Verification",
    description:
      "Cross-reference claims against trusted fact-checking databases and credible news sources in real time.",
  },
  {
    icon: BarChart3,
    title: "Trust Score Metrics",
    description:
      "Get clear, actionable trust scores with detailed breakdowns of credibility, bias, and confidence levels.",
  },
  {
    icon: Globe,
    title: "Universal Content Support",
    description:
      "Analyze text, URLs, images, PDFs, and videos — any format where misinformation can spread.",
  },
  {
    icon: Shield,
    title: "Manipulation Detection",
    description:
      "Identify emotional manipulation, cherry-picked data, false equivalence, and other deceptive techniques.",
  },
  {
    icon: Zap,
    title: "Instant Results",
    description:
      "Get comprehensive analysis reports in seconds, not hours. Make informed decisions quickly.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-white/50 dark:bg-slate-950/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
            Powerful Features for Truth Verification
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Everything you need to combat misinformation and make informed decisions
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-xl hover:shadow-blue-100/50 dark:hover:shadow-blue-900/20 transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex rounded-xl bg-blue-100 p-3 dark:bg-blue-900/50">
                    <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
