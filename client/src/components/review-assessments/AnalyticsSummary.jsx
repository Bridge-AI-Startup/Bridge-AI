import React from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, AlertCircle } from "lucide-react";

export default function AnalyticsSummary({ analytics }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-2xl p-6 border border-gray-200"
    >
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-5 h-5 text-[#1E3A8A]" />
        <h2 className="text-xl font-semibold text-[#0B1121]">Analytics Summary</h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Average Score */}
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#1E3A8A]/10 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-[#1E3A8A]" />
            </div>
            <span className="text-sm text-[#6B7280] font-normal">Average AI Score</span>
          </div>
          <p className="text-3xl font-semibold text-[#0B1121]">{analytics.averageScore}/100</p>
          <div className="w-full bg-gray-200 h-2 rounded-full mt-3">
            <div
              className="h-2 rounded-full bg-[#1E3A8A]"
              style={{ width: `${analytics.averageScore}%` }}
            />
          </div>
        </div>

        {/* Invite Rate */}
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-sm text-[#6B7280] font-normal">Candidates Invited</span>
          </div>
          <p className="text-3xl font-semibold text-[#0B1121]">{analytics.inviteRate}%</p>
          <p className="text-sm text-[#6B7280] font-normal mt-2">
            Above industry average (32%)
          </p>
        </div>

        {/* Common Weaknesses */}
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-red-600" />
            </div>
            <span className="text-sm text-[#6B7280] font-normal">Common Weaknesses</span>
          </div>
          <div className="space-y-2">
            {analytics.commonWeaknesses.slice(0, 3).map((weakness, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm text-[#0B1121] font-normal">{weakness.tag}</span>
                <span className="px-2 py-0.5 bg-gray-200 text-[#6B7280] text-xs font-semibold rounded-full">
                  {weakness.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}