import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function LoadingOverlay() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl p-12 shadow-2xl text-center max-w-md"
      >
        <div className="w-16 h-16 bg-[#1E3A8A] rounded-full flex items-center justify-center mx-auto mb-6">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
        <h3 className="text-2xl font-semibold text-[#0B1121] mb-2">
          Preparing your environment...
        </h3>
        <p className="text-[#6B7280] font-normal">
          Your assessment will begin in a moment
        </p>
      </motion.div>
    </motion.div>
  );
}