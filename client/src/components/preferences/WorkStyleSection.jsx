import React from "react";
import { motion } from "framer-motion";
import { Building, Building2, Globe, HelpCircle, Check } from "lucide-react";

export default function WorkStyleSection({ selected, onToggle, accentColor = "#1E3A8A" }) {
  const styles = [
    { value: "in-person", label: "In-person", icon: Building, description: "Work from the office every day." },
    { value: "hybrid", label: "Hybrid", icon: Building2, description: "Mix of office and remote work." },
    { value: "remote", label: "Remote", icon: Globe, description: "Work entirely from home or anywhere." },
    { value: "no-preference", label: "No preference", icon: HelpCircle, description: "Open to any work style." }
  ];

  const handleToggle = (value) => {
    // If clicking "no-preference", clear all others and select only it
    if (value === "no-preference") {
      if (selected.includes("no-preference")) {
        // If already selected, deselect it
        onToggle(value);
      } else {
        // Clear all and select only no-preference
        onToggle(value, true); // Pass true to indicate "clear others"
      }
    } else {
      // If "no-preference" is selected, remove it when selecting a specific style
      if (selected.includes("no-preference")) {
        onToggle("no-preference"); // Remove no-preference first
      }
      onToggle(value);
    }
  };

  const isSelected = (value) => selected.includes(value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200"
    >
      <h2 className="text-2xl font-semibold text-[#0B1121] mb-2">Work Style</h2>
      <p className="text-gray-600 mb-6 font-normal">Select all work styles you're open to (or choose "No preference")</p>

      <div className="grid md:grid-cols-3 gap-4">
        {styles.map((style) => (
          <button
            key={style.value}
            onClick={() => handleToggle(style.value)}
            className={`p-6 rounded-2xl border-2 transition-all text-left relative ${
              isSelected(style.value)
                ? "border-[#1E3A8A] bg-[#1E3A8A]/5"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            {isSelected(style.value) && (
              <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[#1E3A8A] flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
              isSelected(style.value) ? "bg-[#1E3A8A]" : "bg-gray-100"
            }`}>
              <style.icon className={`w-6 h-6 ${
                isSelected(style.value) ? "text-white" : "text-[#0B1121]"
              }`} />
            </div>
            <h3 className="font-semibold text-[#0B1121] mb-2">{style.label}</h3>
            <p className="text-sm text-gray-600 font-normal">{style.description}</p>
          </button>
        ))}
      </div>
    </motion.div>
  );
}