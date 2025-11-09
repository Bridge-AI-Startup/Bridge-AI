import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function InterviewHeader({ onBack, companyName, role }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-semibold text-[#0B1121] mb-2">
          Book Your Interview
        </h1>
        <p className="text-lg text-[#6B7280] font-normal">
          Schedule your interview with {companyName} for the {role} position
        </p>
      </motion.div>
    </>
  );
}