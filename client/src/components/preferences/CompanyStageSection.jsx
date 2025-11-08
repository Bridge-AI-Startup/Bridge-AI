import React from "react";
import { motion } from "framer-motion";
import { Building, TrendingUp, Factory, Ban } from "lucide-react";

export default function CompanyStageSection({ selected, onSelect, accentColor = "#1E3A8A" }) {
  const stages = [
    { value: "early", label: "Early-stage startup", description: "1–10 employees", icon: Building },
    { value: "growing", label: "Growing startup", description: "10–50 employees", icon: TrendingUp },
    { value: "established", label: "Established startup", description: "50–200 employees", icon: Factory },
    { value: "no-preference", label: "No preference", description: "Any size is fine", icon: Ban }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200"
    >
      <h2 className="text-2xl font-semibold text-[#0B1121] mb-2">Company Stage</h2>
      <p className="text-gray-600 mb-6 font-normal">What stage of startup are you looking for?</p>

      <div className="grid md:grid-cols-3 gap-4">
        {stages.map((stage) => (
          <button
            key={stage.value}
            onClick={() => onSelect(stage.value)}
            className={`p-6 rounded-2xl border-2 transition-all text-left ${
              selected === stage.value
                ? "border-[#1E3A8A] bg-[#1E3A8A]/5"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
              selected === stage.value ? "bg-[#1E3A8A]" : "bg-gray-100"
            }`}>
              <stage.icon className={`w-6 h-6 ${
                selected === stage.value ? "text-white" : "text-[#0B1121]"
              }`} />
            </div>
            <h3 className="font-semibold text-[#0B1121] mb-2">{stage.label}</h3>
            <p className="text-sm text-gray-600 font-normal">{stage.description}</p>
          </button>
        ))}
      </div>
    </motion.div>
  );
}