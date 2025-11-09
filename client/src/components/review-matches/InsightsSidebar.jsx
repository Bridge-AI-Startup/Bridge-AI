import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Award, Clock } from "lucide-react";

export default function InsightsSidebar({ insights, candidates }) {
  const [weeklyDeadline, setWeeklyDeadline] = useState(null);

  useEffect(() => {
    const calculateWeeklyDeadline = () => {
      if (!candidates || candidates.length === 0) return;

      // Find candidates who have started assessments
      const startedCandidates = candidates.filter(c => c.assessmentStarted && c.hoursLeft !== null);
      
      if (startedCandidates.length === 0) {
        setWeeklyDeadline(null);
        return;
      }

      // Find the most urgent deadline (smallest hoursLeft > 0, or most urgent if multiple in progress)
      const inProgressCandidates = startedCandidates.filter(c => c.hoursLeft > 0);
      
      if (inProgressCandidates.length === 0) {
        setWeeklyDeadline(null);
        return;
      }

      // Get the one with least time remaining
      const mostUrgent = inProgressCandidates.reduce((min, c) => 
        c.hoursLeft < min.hoursLeft ? c : min
      );

      const hoursRemaining = mostUrgent.hoursLeft;
      const days = Math.floor(hoursRemaining / 24);
      const hours = hoursRemaining % 24;

      let message = "";
      if (days > 0) {
        message = `${days}d ${hours}h`;
      } else {
        message = `${hours}h`;
      }

      setWeeklyDeadline({
        message,
        hoursRemaining
      });
    };

    calculateWeeklyDeadline();
    const interval = setInterval(calculateWeeklyDeadline, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [candidates]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
      className="bg-white rounded-2xl p-6 border border-gray-200"
    >
      <h3 className="text-lg font-semibold text-[#0B1121] mb-4">
        This Week's Insights
      </h3>

      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-[#1E3A8A]" />
            </div>
            <span className="text-sm text-[#6B7280] font-normal">Total Matches</span>
          </div>
          <p className="text-3xl font-semibold text-[#0B1121]">
            {insights.totalMatches}
          </p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
              <Award className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-sm text-[#6B7280] font-normal">Avg Match Score</span>
          </div>
          <p className="text-3xl font-semibold text-[#0B1121]">
            {insights.avgMatchScore}%
          </p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center">
              <Clock className="w-4 h-4 text-yellow-600" />
            </div>
            <span className="text-sm text-[#6B7280] font-normal">Assesment Deadline</span>
          </div>
          {weeklyDeadline ? (
            <p className="text-3xl font-semibold text-[#0B1121]">
              {weeklyDeadline.message}
            </p>
          ) : (
            <p className="text-3xl font-semibold text-[#6B7280]">
              —
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}