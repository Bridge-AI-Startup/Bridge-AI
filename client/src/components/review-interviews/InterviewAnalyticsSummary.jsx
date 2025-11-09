import React from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Star } from "lucide-react";

export default function InterviewAnalyticsSummary({ analytics }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-2xl p-6 border border-gray-200"
    >
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-5 h-5 text-[#1E3A8A]" />
        <h2 className="text-xl font-semibold text-[#0B1121]">Interview Analytics</h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Average Rating */}
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#1E3A8A]/10 flex items-center justify-center">
              <Star className="w-4 h-4 text-[#1E3A8A]" />
            </div>
            <span className="text-sm text-[#6B7280] font-normal">Average Rating</span>
          </div>
          <p className="text-3xl font-semibold text-[#0B1121]">{analytics.averageRating}/10</p>
          <div className="flex items-center gap-1 mt-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.round(analytics.averageRating / 2)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Completion Rate */}
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-sm text-[#6B7280] font-normal">Completion Rate</span>
          </div>
          <p className="text-3xl font-semibold text-[#0B1121]">{analytics.completionRate}%</p>
          <p className="text-sm text-[#6B7280] font-normal mt-2">
            Interviews completed on time
          </p>
        </div>

        {/* Top Strengths */}
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-sm text-[#6B7280] font-normal">Top Strengths</span>
          </div>
          <div className="space-y-2">
            {analytics.topStrengths.slice(0, 3).map((strength, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm text-[#0B1121] font-normal">{strength.tag}</span>
                <span className="px-2 py-0.5 bg-gray-200 text-[#6B7280] text-xs font-semibold rounded-full">
                  {strength.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}