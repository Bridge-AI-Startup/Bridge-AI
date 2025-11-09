import React from "react";
import { motion } from "framer-motion";

export default function ProjectsHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center mb-12"
    >
      <h1 className="text-5xl font-semibold text-[#0B1121] mb-4">
        Add your projects
      </h1>
      <p className="text-xl text-[#6B7280] font-normal max-w-2xl mx-auto">
        Your code and projects tell the story a résumé can’t. Our algorithm analyzes them to build your 3D skill profile and match you with the right startups
      </p>
    </motion.div>
  );
}