import React from "react";
import { motion } from "framer-motion";

export default function AssessmentsTabs({ activeTab, setActiveTab, assessments }) {
  const tabs = [
    { id: "all", label: "All Assessments", count: assessments.length },
    { id: "pending", label: "Pending Review", count: assessments.filter(a => a.status === "pending").length },
    { id: "completed", label: "Completed", count: assessments.filter(a => a.status === "completed").length },
    { id: "flagged", label: "Flagged", count: assessments.filter(a => a.status === "flagged").length }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-2xl p-2 border border-gray-200 mb-6 flex gap-2"
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
            activeTab === tab.id
              ? 'bg-[#1E3A8A] text-white'
              : 'text-[#6B7280] hover:bg-gray-100'
          }`}
        >
          {tab.label}
          <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
            activeTab === tab.id
              ? 'bg-white/20 text-white'
              : 'bg-gray-200 text-[#6B7280]'
          }`}>
            {tab.count}
          </span>
        </button>
      ))}
    </motion.div>
  );
}