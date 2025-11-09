import React from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Linkedin, CheckCircle2 } from "lucide-react";

export default function LinkedInCard({ linkedinUrl, isLinkedinValid, onChange }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={`
        flex flex-col h-full min-h-[280px]
        bg-gray-50 border-2 rounded-3xl p-8 transition-all duration-200
        ${isLinkedinValid ? "border-green-500 bg-green-50" : "border-gray-300"}
      `}
    >
      <div className="flex flex-col items-center text-center mb-6">
        {isLinkedinValid ? (
          <CheckCircle2 className="w-12 h-12 text-green-600 mb-4" />
        ) : (
          <Linkedin className="w-12 h-12 text-[#0077B5] mb-4" />
        )}
        <p className="text-[#0B1121] font-semibold mb-2">Connect LinkedIn</p>
        <p className="text-sm text-[#6B7280] font-normal">
          Paste your profile URL
        </p>
      </div>

      <Input
        type="url"
        placeholder="linkedin.com/in/yourprofile"
        value={linkedinUrl}
        onChange={onChange}
        className="h-12 text-base rounded-xl border-gray-300 focus:border-[#1E3A8A]"
      />
    </motion.div>
  );
}