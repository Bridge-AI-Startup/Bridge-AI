import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, FileCheck, Award, X, Github, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export default function MatchCard({ candidate, isSelected, onToggleSelect, delay }) {
  const navigate = useNavigate();

  const handleCheckboxClick = (e) => {
    e.stopPropagation();
  };

  const handleCardClick = () => {
    navigate(`/ApplicantProfile?name=${encodeURIComponent(candidate.name)}`);
  };

  const handleAssignProject = (e) => {
    e.stopPropagation();
    navigate(`/AssignProject?candidate=${candidate.id}`);
  };

  const handleScheduleInterview = (e) => {
    e.stopPropagation();
    navigate(`/ScheduleInterview?candidate=${candidate.name}`);
  };

  const handleExtendOffer = (e) => {
    e.stopPropagation();
    // Handle extend offer action
    console.log("Extend offer to:", candidate.name);
  };

  const handlePass = (e) => {
    e.stopPropagation();
    // Handle pass action
    console.log("Pass on:", candidate.name);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      onClick={handleCardClick}
      className="bg-white rounded-2xl p-5 border-2 border-gray-200 hover:border-[#1E3A8A] transition-all cursor-pointer group"
    >
      <div className="flex items-start gap-3 mb-4">
        <div onClick={handleCheckboxClick}>
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onToggleSelect(candidate.id)}
            className="w-5 h-5"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-[#0B1121] truncate group-hover:text-[#1E3A8A] transition-colors">
                {candidate.name}
              </h3>
              <p className="text-sm text-[#6B7280] font-normal">
                {candidate.university} • {candidate.gradYear}
              </p>
            </div>
            <div className="px-3 py-1.5 bg-[#1E3A8A] text-white rounded-full text-sm font-semibold flex-shrink-0">
              {candidate.matchScore}%
            </div>
          </div>
          <p className="text-sm text-[#6B7280] font-normal mb-3">
            {candidate.role}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex flex-wrap gap-2 mb-3">
          {candidate.skills.slice(0, 4).map((skill, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 bg-gray-100 text-[#0B1121] rounded-lg text-xs font-medium"
            >
              {skill}
            </span>
          ))}
          {candidate.skills.length > 4 && (
            <span className="px-2.5 py-1 bg-gray-100 text-[#6B7280] rounded-lg text-xs font-medium">
              +{candidate.skills.length - 4}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {candidate.hasGithub && (
            <div className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-lg">
              <Github className="w-3.5 h-3.5 text-[#6B7280]" />
              <span className="text-xs text-[#6B7280] font-medium">GitHub</span>
            </div>
          )}
          {candidate.hasPortfolio && (
            <div className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-lg">
              <ExternalLink className="w-3.5 h-3.5 text-[#6B7280]" />
              <span className="text-xs text-[#6B7280] font-medium">Portfolio</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 mb-4">
        <p className="text-sm text-[#0B1121] font-normal">
          <span className="font-semibold">Why this match: </span>
          {candidate.matchReason}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button
          onClick={handleAssignProject}
          variant="outline"
          size="sm"
          className="h-9 rounded-xl border-2 border-gray-200 hover:border-[#1E3A8A] text-xs"
        >
          <FileCheck className="w-3.5 h-3.5 mr-1" />
          Assign Project
        </Button>
        <Button
          onClick={handleScheduleInterview}
          size="sm"
          className="h-9 rounded-xl font-medium bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white text-xs"
        >
          <Calendar className="w-3.5 h-3.5 mr-1" />
          Schedule
        </Button>
        <Button
          onClick={handleExtendOffer}
          variant="outline"
          size="sm"
          className="h-9 rounded-xl border-2 border-gray-200 hover:border-green-600 hover:text-green-600 text-xs"
        >
          <Award className="w-3.5 h-3.5 mr-1" />
          Extend Offer
        </Button>
        <Button
          onClick={handlePass}
          variant="outline"
          size="sm"
          className="h-9 rounded-xl border-2 border-gray-200 hover:border-red-600 hover:text-red-600 text-xs"
        >
          <X className="w-3.5 h-3.5 mr-1" />
          Pass
        </Button>
      </div>
    </motion.div>
  );
}