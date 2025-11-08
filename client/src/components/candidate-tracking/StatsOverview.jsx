import React from "react";
import { motion } from "framer-motion";

export default function StatsOverview({ sections, colorClasses, onSectionClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="grid grid-cols-5 gap-4 mb-8"
    >
      {sections.map((section, idx) => {
        const SectionIcon = section.icon;
        const colors = colorClasses[section.color];
        return (
          <button
            key={section.id}
            onClick={() => onSectionClick(section.id)}
            className={`${colors.bg} rounded-xl p-4 border ${colors.border} hover:scale-105 transition-transform cursor-pointer relative`}
          >
            <SectionIcon className={`w-5 h-5 mb-2 ${colors.text}`} />
            <p className="text-2xl font-semibold text-[#0B1121] mb-1">{section.count}</p>
            <p className="text-xs text-[#6B7280] font-normal">{section.label}</p>
          </button>
        );
      })}
    </motion.div>
  );
}