import React from "react";
import { motion } from "framer-motion";

export default function PreferencesHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center mb-12"
    >
      <h1 className="text-5xl font-semibold text-[#0B1121] mb-4">
        What kind of company excites you?
      </h1>
      <p className="text-xl text-[#6B7280] font-normal max-w-2xl mx-auto">
        Tell us what environments and missions you'd thrive in — this helps us match you with startups that fit your goals and working style.
      </p>
    </motion.div>
  );
}