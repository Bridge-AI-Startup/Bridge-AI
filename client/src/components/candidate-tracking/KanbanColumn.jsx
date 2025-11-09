import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import KanbanCard from "./KanbanCard";

export default function KanbanColumn({
  stage,
  candidates,
  delay,
  stageId,
  onReviewAssessment,
  onViewAll,
  onOpenModal,
  showViewDashboard = true
}) {
  // Darker color accents for top border
  const colorAccents = {
    blue: "border-t-blue-700",
    yellow: "border-t-amber-700",
    purple: "border-t-purple-700",
    green: "border-t-emerald-700",
    fuchsia: "border-t-fuchsia-700"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 100 }}
      className="flex flex-col min-w-0"
    >
      <div className={`bg-white rounded-2xl border border-gray-200 border-t-[3px] ${colorAccents[stage.color]} shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col overflow-hidden`}>
        {/* Column Header */}
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-start justify-between mb-3 min-h-[44px]">
            <h3 className="font-semibold text-[#0B1121] text-base leading-tight line-clamp-2 flex-1 pr-2">{stage.label}</h3>
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 border border-gray-200 flex-shrink-0">
              <span className="text-sm font-semibold text-[#6B7280]">
                {candidates.length}
              </span>
            </div>
          </div>
          {showViewDashboard && (
            <Button
              onClick={onViewAll}
              variant="outline"
              size="sm"
              className="w-full h-9 rounded-lg border transition-all duration-200 text-[#0B1121] border-gray-300 hover:bg-gray-100 hover:border-gray-400 font-medium text-xs shadow-sm"
            >
              View Dashboard
            </Button>
          )}
        </div>

        {/* Candidate Cards */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 bg-gray-50/40 min-h-[400px]">
          {candidates.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl text-gray-300">·</span>
              </div>
              <p className="text-sm text-[#6B7280] font-normal">No candidates yet</p>
            </div>
          ) : (
            candidates.map((candidate, idx) => (
              <motion.div
                key={candidate.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: delay + (idx * 0.03), duration: 0.3 }}
              >
                <KanbanCard
                  candidate={candidate}
                  stageId={stage.id}
                  onReviewAssessment={onReviewAssessment}
                  onOpenModal={onOpenModal}
                />
              </motion.div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}