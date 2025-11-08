import React from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

export default function KanbanCard({ 
  candidate, 
  stageId, 
  onReviewAssessment,
  onOpenModal
}) {
  const handleCardClick = () => {
    onOpenModal(candidate);
  };

  // Get signal color based on score/rating
  const getSignalColor = () => {
    let score = 0;
    
    if (stageId === "new") {
      score = parseInt(candidate.match);
    } else if (stageId === "assessment" && candidate.aiScore) {
      score = candidate.aiScore;
    } else if (stageId === "interviewed" && candidate.interviewRating) {
      score = candidate.interviewRating * 10;
    } else if (candidate.match) {
      score = parseInt(candidate.match);
    }

    if (score >= 90) return "bg-emerald-100 text-emerald-700 border border-emerald-200";
    if (score >= 75) return "bg-amber-100 text-amber-700 border border-amber-200";
    return "bg-gray-100 text-gray-600 border border-gray-200";
  };

  // Get primary metric to display at bottom
  const getPrimaryMetric = () => {
    if (stageId === "new") {
      // Check for completed status first
      if (candidate.assessmentStatus === "completed") {
        return { label: "Completed", value: "", color: "text-green-600", bg: "bg-green-50" };
      }
      if (candidate.assessmentStarted && candidate.hoursLeft !== undefined) {
        if (candidate.hoursLeft < 0) {
          return { label: "Overdue", value: "", color: "text-red-600", bg: "bg-red-50" };
        }
        return { label: `${candidate.hoursLeft}h left`, value: "", color: "text-blue-600", bg: "bg-blue-50" };
      }
      return { label: "Not started", value: "", color: "text-gray-500", bg: "bg-gray-50" };
    } else if (stageId === "interview") {
      // Handle interview stage
      if (candidate.interviewStatus === "scheduled") {
        return { label: candidate.date || "Scheduled", value: "", color: "text-purple-600", bg: "bg-purple-50" };
      } else if (candidate.interviewStatus === "needsScheduling") {
        return { label: "Pending", value: "", color: "text-amber-600", bg: "bg-amber-50" };
      } else if (candidate.interviewStatus === "completed") {
        return { label: "Completed", value: "", color: "text-green-600", bg: "bg-green-50" };
      }
      return { label: "Interview", value: "", color: "text-purple-600", bg: "bg-purple-50" };
    } else if (stageId === "assessment" && candidate.aiScore) {
      return { label: `Assessment: ${candidate.aiScore}`, color: "text-blue-700", bg: "bg-blue-50" };
    } else if (stageId === "interviewed" && candidate.interviewRating) {
      return { label: `Rating: ${candidate.interviewRating}/10`, color: "text-green-700", bg: "bg-green-50" };
    } else if (stageId === "interview-scheduled") {
      return { label: candidate.date || "Scheduled", value: "", color: "text-purple-600", bg: "bg-purple-50" };
    } else if (stageId === "offer") {
      const statusMap = {
        accepted: { label: "Accepted", color: "text-emerald-600", bg: "bg-emerald-50" },
        declined: { label: "Declined", color: "text-red-600", bg: "bg-red-50" },
        waiting: { label: "Pending", color: "text-amber-700", bg: "bg-amber-50" }
      };
      const status = statusMap[candidate.offerStatus] || { label: "Sent", color: "text-gray-600", bg: "bg-gray-50" };
      return { label: status.label, value: "", color: status.color, bg: status.bg };
    }
    
    return null;
  };

  const metric = getPrimaryMetric();

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      onClick={handleCardClick}
      className="bg-white rounded-xl p-4 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-semibold text-[#0B1121] text-sm leading-tight group-hover:text-[#1E3A8A] transition-colors flex-1 min-w-0">
          {candidate.name}
        </h4>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${getSignalColor()} flex-shrink-0 ml-2`}>
          {candidate.match}
        </span>
      </div>
      
      {metric && (
        <div className="flex items-center justify-between">
          <span className={`text-xs font-medium ${metric.color} ${metric.bg} px-2 py-1 rounded-md`}>
            {metric.label}
          </span>
          {metric.value && (
            <span className={`text-sm font-semibold ${metric.color}`}>
              {metric.value}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
}