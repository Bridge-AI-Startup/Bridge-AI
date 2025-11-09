import React from "react";
import { motion } from "framer-motion";

export default function ParseHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center mb-8"
    >
      <h1 className="text-4xl md:text-5xl font-semibold text-white mb-4">
        Analyzing your background…
      </h1>
      <p className="text-lg text-gray-300 font-normal">
        We're building your skill map to find your best-fit internships.
      </p>
    </motion.div>
  );
}