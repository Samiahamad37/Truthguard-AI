"use client";

import { motion } from "framer-motion";
import { Upload, Cpu, FileCheck } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Upload,
    title: "Submit Content",
    description:
      "Paste text, enter a URL, or upload images, PDFs, and videos for analysis.",
  },
  {
    step: "02",
    icon: Cpu,
    title: "AI Analysis",
    description:
      "Our AI engine scans for misinformation patterns, bias, manipulation, and factual accuracy.",
  },
  {
    step: "03",
    icon: FileCheck,
    title: "Get Results",
    description:
      "Receive a detailed trust score report with evidence sources and recommended actions.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Three simple steps to verify any information
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3 relative">
          <div className="hidden md:block absolute top-16 left-[16.67%] right-[16.67%] h-0.5 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 dark:from-blue-800 dark:via-blue-600 dark:to-blue-800" />

          {steps.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="relative text-center"
            >
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/30 relative z-10">
                <item.icon className="h-7 w-7" />
              </div>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 tracking-wider">
                STEP {item.step}
              </span>
              <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">
                {item.title}
              </h3>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
