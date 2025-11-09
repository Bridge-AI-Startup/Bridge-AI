import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import CandidateCard from "./CandidateCard";

export default function SectionCard({ 
  section, 
  isExpanded, 
  onToggle, 
  colorClasses, 
  sectionRef, 
  delay = 0,
  selectedCandidates,
  onToggleSelect,
  onToggleSelectAll
}) {
  const SectionIcon = section.icon;
  const colors = colorClasses[section.color];
  
  const allSelected = section.candidates.every(c => selectedCandidates.includes(c.id));
  const someSelected = section.candidates.some(c => selectedCandidates.includes(c.id)) && !allSelected;

  const handleSelectAll = (e) => {
    e.stopPropagation();
    onToggleSelectAll(section.id);
  };

  return (
    <motion.div
      ref={sectionRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow scroll-mt-24"
    >
      {/* Section Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div onClick={handleSelectAll} className="z-10">
            <Checkbox 
              checked={allSelected}
              className="w-5 h-5"
              ref={(el) => {
                if (el && someSelected) {
                  el.indeterminate = true;
                }
              }}
            />
          </div>
          <div className={`w-10 h-10 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center relative`}>
            <SectionIcon className={`w-5 h-5 ${colors.text}`} />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-[#0B1121]">{section.label}</h3>
            </div>
            <p className="text-sm text-[#6B7280] font-normal">{section.count} candidates</p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-[#6B7280]" />
        </motion.div>
      </button>

      {/* Collapsed Preview */}
      {!isExpanded && section.candidates.length > 0 && (
        <div className="px-6 pb-4">
          <div className="flex -space-x-2">
            {section.candidates.slice(0, 3).map((candidate) => (
              <div
                key={candidate.id}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] flex items-center justify-center flex-shrink-0 border-2 border-white"
                title={candidate.name}
              >
                <span className="text-white text-xs font-semibold">
                  {candidate.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
            ))}
            {section.candidates.length > 3 && (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 border-2 border-white">
                <span className="text-gray-600 text-xs font-semibold">
                  +{section.candidates.length - 3}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Candidate Cards */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="border-t border-gray-200"
          >
            <div className="p-6 space-y-4">
              {section.candidates.map((candidate, idx) => (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  section={section}
                  delay={idx * 0.05}
                  isSelected={selectedCandidates.includes(candidate.id)}
                  onToggleSelect={onToggleSelect}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}