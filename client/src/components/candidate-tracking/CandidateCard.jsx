
import React from "react";
import { motion } from "framer-motion";
import { Calendar, FileCheck, Sparkles, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";

export default function CandidateCard({ candidate, section, delay = 0, isSelected, onToggleSelect }) {
  const navigate = useNavigate();

  const handleViewProfile = () => {
    navigate(`/ApplicantProfile?candidateId=${candidate.id}`);
  };

  const handleScheduleInterview = (e) => {
    e.stopPropagation();
    navigate(`/ScheduleInterview?candidateId=${candidate.id}&candidateName=${encodeURIComponent(candidate.name)}`);
  };

  const handleAssignProject = (e) => {
    e.stopPropagation();
    navigate(`/AssignProject?candidateId=${candidate.id}&candidateName=${encodeURIComponent(candidate.name)}`);
  };

  const handlePass = (e) => {
    e.stopPropagation();
    // Handle pass logic here
    console.log("Passed on candidate:", candidate.id);
  };

  const handleCheckboxClick = (e) => {
    e.stopPropagation();
    onToggleSelect(candidate.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ delay }}
      onClick={handleViewProfile}
      className={`bg-gray-50 rounded-2xl p-6 border-2 transition-all cursor-pointer ${
        isSelected 
          ? 'border-[#1E3A8A] shadow-md' 
          : 'border-gray-200 hover:border-[#1E3A8A] hover:shadow-sm'
      }`}
    >
      <div className="flex items-start gap-4 mb-4">
        <div onClick={handleCheckboxClick} className="pt-1">
          <Checkbox 
            checked={isSelected}
            className="w-5 h-5"
          />
        </div>
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] flex items-center justify-center flex-shrink-0">
          <User className="w-8 h-8 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="min-w-0">
              <h4 className="text-xl font-semibold text-[#0B1121] truncate">{candidate.name}</h4>
              <p className="text-base text-[#6B7280] truncate font-normal">{candidate.role}</p>
            </div>
            <span className="px-4 py-2 bg-[#1E3A8A] text-white text-base font-semibold rounded-full flex-shrink-0">
              {candidate.match}
            </span>
          </div>
        </div>
      </div>

      {candidate.insight && (
        <div className="mb-4 p-4 bg-white rounded-xl border border-gray-200">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-[#1E3A8A]" />
            </div>
            <div>
              <p className="text-[#0B1121] font-semibold mb-1 text-sm">Why this is a great match</p>
              <p className="text-sm text-[#6B7280] font-normal leading-relaxed">
                {candidate.insight}
              </p>
            </div>
          </div>
        </div>
      )}

      {(candidate.date || candidate.dueDate || candidate.completedDate) && (
        <p className="text-sm text-[#6B7280] font-normal mb-4">
          {candidate.date && `📅 ${candidate.date}`}
          {candidate.dueDate && `⏰ Due ${candidate.dueDate}`}
          {candidate.completedDate && `✅ Completed ${candidate.completedDate}`}
        </p>
      )}

      <div className="mb-4">
        <h5 className="text-[#0B1121] font-semibold mb-2 text-sm">Skills overlap</h5>
        <div className="flex flex-wrap gap-2">
          {candidate.skills.map((skill, idx) => (
            <span key={idx} className="px-3 py-1.5 bg-white text-[#0B1121] text-sm rounded-lg border border-gray-200 font-normal">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="flex gap-3" onClick={(e) => e.stopPropagation()}>
        {section.id === "new" && (
          <>
            <Button 
              onClick={handleScheduleInterview}
              className="flex-1 h-12 bg-[#1E3A8A] text-white rounded-xl hover:bg-[#1E3A8A]/90"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Interview
            </Button>
            <Button 
              onClick={handleAssignProject}
              className="flex-1 h-12 bg-[#1E3A8A] text-white rounded-xl hover:bg-[#1E3A8A]/90"
            >
              <FileCheck className="w-4 h-4 mr-2" />
              Assign Project
            </Button>
            <Button 
              onClick={handlePass}
              variant="outline" 
              className="flex-1 h-12 rounded-xl border-2 border-gray-200 hover:border-red-500 hover:text-red-600"
            >
              <X className="w-4 h-4 mr-2" />
              Pass
            </Button>
          </>
        )}
        {(section.id === "interviewed" || section.id === "assessment-complete") && (
          <>
            <Button 
              onClick={handleScheduleInterview}
              className="flex-1 h-12 bg-[#1E3A8A] text-white rounded-xl hover:bg-[#1E3A8A]/90"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Next Round
            </Button>
            <Button 
              onClick={handlePass}
              variant="outline" 
              className="flex-1 h-12 rounded-xl border-2 border-gray-200 hover:border-red-500 hover:text-red-600"
            >
              <X className="w-4 h-4 mr-2" />
              Pass
            </Button>
          </>
        )}
      </div>
    </motion.div>
  );
}
