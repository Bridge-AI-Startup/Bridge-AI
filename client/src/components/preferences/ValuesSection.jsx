import React from "react";
import { motion } from "framer-motion";
import { Zap, Globe, BookOpen, Building, Lightbulb } from "lucide-react";

export default function ValuesSection({ selected, onToggle, accentColor = "#1E3A8A" }) {
  const values = [
    { value: "fast-paced", label: "Fast-paced & innovative", icon: Zap, description: "Thrive in a dynamic, high-energy environment." },
    { value: "mission-driven", label: "Mission-driven", icon: Globe, description: "Contribute to a cause greater than oneself." },
    { value: "mentorship", label: "Mentorship & learning", icon: BookOpen, description: "Grow through guidance and continuous education." },
    { value: "structure", label: "Structure & stability", icon: Building, description: "Prefer clear processes and a predictable environment." },
    { value: "creative", label: "Creative freedom", icon: Lightbulb, description: "Innovate and express ideas without strict limitations." }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200"
    >
      <h2 className="text-2xl font-semibold text-[#0B1121] mb-2">Company Values</h2>
      <p className="text-gray-600 mb-6 font-normal">What values are important to you? (Select all that apply)</p>

      <div className="grid md:grid-cols-3 gap-4">
        {values.map((value) => {
          const isSelected = selected.includes(value.value);
          return (
            <button
              key={value.value}
              onClick={() => onToggle(value.value)}
              className={`p-6 rounded-2xl border-2 transition-all text-left ${
                isSelected
                  ? "border-[#1E3A8A] bg-[#1E3A8A]/5"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                isSelected ? "bg-[#1E3A8A]" : "bg-gray-100"
              }`}>
                <value.icon className={`w-6 h-6 ${
                  isSelected ? "text-white" : "text-[#0B1121]"
                }`} />
              </div>
              <h3 className="font-semibold text-[#0B1121] mb-2">{value.label}</h3>
              <p className="text-sm text-gray-600 font-normal">{value.description}</p>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}