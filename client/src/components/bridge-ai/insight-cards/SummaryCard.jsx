import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, Award, Clock } from "lucide-react";

export default function SummaryCard({ title, summary, metrics }) {
  const metricIcons = {
    avgScore: Award,
    passRate: TrendingUp,
    avgTime: Clock
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-200 p-5 mb-4"
    >
      <h3 className="text-base font-semibold text-[#0B1121] mb-4">{title}</h3>
      
      <div className="grid grid-cols-3 gap-3 mb-4">
        {metrics.map((metric) => {
          const Icon = metricIcons[metric.key] || Award;
          return (
            <div key={metric.key} className="p-3 rounded-lg bg-gray-50 border border-gray-200">
              <Icon className="w-4 h-4 text-[#1E3A8A] mb-1" />
              <p className="text-xs text-[#6B7280] font-normal mb-0.5">{metric.label}</p>
              <p className="text-lg font-semibold text-[#0B1121]">{metric.value}</p>
            </div>
          );
        })}
      </div>

      <div className="space-y-2">
        {summary.map((item, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <span className="text-[#1E3A8A] mt-0.5">•</span>
            <p className="text-sm text-[#0B1121]">{item}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}