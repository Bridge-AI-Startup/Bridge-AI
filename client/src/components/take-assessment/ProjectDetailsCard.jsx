import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, FileText } from "lucide-react";

export default function ProjectDetailsCard({ projectData }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-2xl p-8 border border-gray-200"
    >
      <h2 className="text-2xl font-semibold text-[#0B1121] mb-4">
        {projectData.title}
      </h2>
      
      <p className="text-[#6B7280] font-normal mb-6 leading-relaxed">
        {projectData.description}
      </p>

      <div className="space-y-6">
        {/* Requirements */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-[#1E3A8A]" />
            <h3 className="text-lg font-semibold text-[#0B1121]">
              Requirements
            </h3>
          </div>
          <ul className="space-y-2">
            {projectData.requirements.map((req, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-[#0B1121] flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-[#6B7280] font-normal">{req}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Acceptance Criteria */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-[#1E3A8A]" />
            <h3 className="text-lg font-semibold text-[#0B1121]">
              Deliverables / Acceptance Criteria
            </h3>
          </div>
          <ul className="space-y-2">
            {projectData.acceptanceCriteria.map((criteria, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-[#6B7280] font-normal">{criteria}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}