import React from "react";
import { motion } from "framer-motion";

export default function PromptChips({ prompts, onPromptRun }) {
  return (
    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
      <p className="text-xs text-[#6B7280] font-normal mb-2">Suggested prompts</p>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {prompts.map((prompt, idx) => (
          <motion.button
            key={prompt.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => onPromptRun({ promptId: prompt.id })}
            className="flex-shrink-0 px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 hover:border-[#1E3A8A] transition-colors text-sm text-[#0B1121] font-normal"
          >
            {prompt.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}