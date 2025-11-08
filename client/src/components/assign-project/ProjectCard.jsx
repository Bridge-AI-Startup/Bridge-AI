import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight, Sparkles } from "lucide-react";

export default function ProjectCard({ project, onSelect, delay, isRecommended }) {
  const difficultyColors = {
    Beginner: "bg-green-100 text-green-800",
    Intermediate: "bg-yellow-100 text-yellow-800",
    Advanced: "bg-red-100 text-red-800"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`bg-white rounded-2xl p-6 border-2 hover:shadow-lg transition-all group cursor-pointer ${
        isRecommended 
          ? 'border-gray-200 shadow-md' 
          : 'border-gray-200 hover:border-[#1E3A8A]'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 pr-4">
          <h3 className="text-xl font-semibold text-[#0B1121] group-hover:text-[#1E3A8A] transition-colors">
            {project.title}
          </h3>
          {isRecommended && (
            <span className="px-3 py-1 bg-blue-50 text-[#1E3A8A] text-xs font-semibold rounded-full border border-blue-200 whitespace-nowrap">
              RECOMMENDED
            </span>
          )}
        </div>
        <ArrowRight className="w-5 h-5 text-[#6B7280] group-hover:text-[#1E3A8A] group-hover:translate-x-1 transition-all flex-shrink-0" />
      </div>

      <p className="text-[#6B7280] font-normal mb-4 line-clamp-2">
        {project.shortDescription}
      </p>

      <div className="p-3 rounded-xl border border-gray-200 bg-gray-50 mb-4">
        <div className="flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-[#1E3A8A] flex-shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-[#0B1121] mb-1">Why This Project</p>
            <p className="text-sm text-[#6B7280] font-normal leading-relaxed">
              {project.whyCurated}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4 text-sm">
        <div className="flex items-center gap-1.5 text-[#6B7280]">
          <Clock className="w-4 h-4" />
          <span className="font-normal">{project.estimatedTime}</span>
        </div>
        <div className={`px-3 py-1 rounded-lg text-xs font-semibold ${difficultyColors[project.difficulty]}`}>
          {project.difficulty}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs font-semibold text-[#0B1121] mb-2">Skills Tested:</p>
        <div className="flex flex-wrap gap-2">
          {project.skills.slice(0, 4).map((skill, i) => (
            <span
              key={i}
              className="px-2.5 py-1 bg-gray-100 text-[#0B1121] rounded-lg text-xs font-normal"
            >
              {skill}
            </span>
          ))}
          {project.skills.length > 4 && (
            <span className="px-2.5 py-1 bg-gray-100 text-[#6B7280] rounded-lg text-xs font-normal">
              +{project.skills.length - 4} more
            </span>
          )}
        </div>
      </div>

      <Button
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        className="w-full h-11 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white rounded-xl font-medium"
      >
        View Project
      </Button>
    </motion.div>
  );
}