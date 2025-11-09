import React from "react";
import { motion } from "framer-motion";

export default function OnboardingHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center mb-12"
    >
      <h1 className="text-5xl font-semibold text-[#0B1121] mb-4">
        Let's get you matched.
      </h1>
      <p className="text-xl text-[#6B7280] font-normal">
        Upload your resume or connect LinkedIn. We'll auto-capture your experience.
      </p>
    </motion.div>
  );
}