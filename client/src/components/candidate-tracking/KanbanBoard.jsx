import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import KanbanColumn from "./KanbanColumn";

export default function KanbanBoard({
  stages,
  filteredCandidates,
  onReviewAssessment,
  onViewAll,
  onOpenModal,
  searchQuery,
  onSearchChange,
  showViewDashboard = true
}) {
  // Determine grid columns based on number of stages
  const gridColsClass = stages.length === 5 ? "grid-cols-5" : stages.length === 4 ? "grid-cols-4" : "grid-cols-3";
  
  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/80 shadow-sm">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search candidates..."
            className="h-11 pl-11 rounded-xl bg-white border-gray-300 shadow-sm focus:shadow-md transition-shadow"
          />
        </div>
      </div>

      {/* Kanban Columns */}
      <div className={`grid ${gridColsClass} gap-3`}>
        {stages.map((stage, idx) => (
          <KanbanColumn
            key={stage.id}
            stage={stage}
            candidates={filteredCandidates[stage.id] || []}
            delay={idx * 0.08}
            stageId={stage.id}
            onReviewAssessment={onReviewAssessment}
            onViewAll={() => onViewAll(stage.id)}
            onOpenModal={(candidate) => onOpenModal(candidate, stage.id)}
            showViewDashboard={showViewDashboard}
          />
        ))}
      </div>
    </div>
  );
}