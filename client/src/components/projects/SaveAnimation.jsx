import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function SaveAnimation({ isSaving }) {
  return (
    <AnimatePresence>
      {isSaving && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="flex justify-center mb-8"
        >
          <div className="flex items-center gap-3 px-6 py-3 bg-[#FFFF00] rounded-full shadow-lg">
            <Sparkles className="w-5 h-5 text-[#1E3A8A] animate-pulse" />
            <span className="text-[#1E3A8A] font-semibold">Expanding your skill map...</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}