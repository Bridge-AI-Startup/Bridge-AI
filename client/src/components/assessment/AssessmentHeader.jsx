import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function AssessmentHeader({ onBack }) {
  return (
    <div className="mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="text-4xl font-semibold text-[#0B1121]">
          Assessment Overview
        </h1>
      </motion.div>
    </div>
  );
}