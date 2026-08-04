"use client";

import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const trustTrendData = [
  { month: "Jan", score: 68 },
  { month: "Feb", score: 72 },
  { month: "Mar", score: 70 },
  { month: "Apr", score: 75 },
  { month: "May", score: 73 },
  { month: "Jun", score: 78 },
];

const contentTypeData = [
  { name: "URL", value: 45, color: "#2563eb" },
  { name: "Text", value: 30, color: "#3b82f6" },
  { name: "Image", value: 15, color: "#60a5fa" },
  { name: "PDF", value: 7, color: "#93c5fd" },
  { name: "Video", value: 3, color: "#bfdbfe" },
];

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function ChartCard({ title, children, className }: ChartCardProps) {
  return (
    <div className={className}>
      <h3 className="mb-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
        {title}
      </h3>
      {children}
    </div>
  );
}

export function TrustTrendChart() {
  return (
    <ChartCard title="Trust Score Trend">
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={trustTrendData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} className="text-slate-500" />
          <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} className="text-slate-500" />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255,255,255,0.9)",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
            }}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#2563eb"
            strokeWidth={2}
            dot={{ fill: "#2563eb", r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function ContentTypeChart() {
  return (
    <ChartCard title="Analyses by Content Type">
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={contentTypeData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={4}
            dataKey="value"
          >
            {contentTypeData.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        {contentTypeData.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
            <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            {item.name} ({item.value}%)
          </div>
        ))}
      </div>
    </ChartCard>
  );
}

export function WeeklyAnalysisChart() {
  const data = [
    { day: "Mon", analyses: 12, flagged: 3 },
    { day: "Tue", analyses: 19, flagged: 5 },
    { day: "Wed", analyses: 15, flagged: 2 },
    { day: "Thu", analyses: 22, flagged: 7 },
    { day: "Fri", analyses: 18, flagged: 4 },
    { day: "Sat", analyses: 8, flagged: 1 },
    { day: "Sun", analyses: 6, flagged: 1 },
  ];

  return (
    <ChartCard title="Weekly Analysis Activity">
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
          <XAxis dataKey="day" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="analyses" fill="#2563eb" radius={[4, 4, 0, 0]} name="Total" />
          <Bar dataKey="flagged" fill="#ef4444" radius={[4, 4, 0, 0]} name="Flagged" />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function BiasRadarChart({ data }: { data: { label: string; value: number }[] }) {
  return (
    <div className="space-y-3">
      {data.map((item) => (
        <div key={item.label}>
          <div className="mb-1 flex justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">{item.label}</span>
            <span className="font-medium text-slate-900 dark:text-white">{item.value}%</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${item.value}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
