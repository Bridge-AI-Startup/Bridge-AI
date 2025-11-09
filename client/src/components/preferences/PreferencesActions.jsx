import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PreferencesActions({ hasSelection, onSave, onBack }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8"
    >
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[#6B7280] hover:text-[#0B1121] transition-colors font-normal"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <Button
        onClick={onSave}
        disabled={!hasSelection}
        className="h-14 px-10 text-lg font-medium rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ 
          backgroundColor: hasSelection ? '#FFFF00' : '#E5E5E5',
          color: hasSelection ? '#1E3A8A' : '#9CA3AF'
        }}
      >
        Continue
      </Button>
    </motion.div>
  );
}