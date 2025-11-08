import React from "react";
import { motion } from "framer-motion";

export default function StatsCard({ label, value, icon: Icon, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm"
    >
      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gray-100">
        <Icon className="w-6 h-6 text-[#0B1121]" />
      </div>
      <p className="text-[#6B7280] text-sm mb-1 font-normal">{label}</p>
      <p className="text-3xl font-semibold text-[#0B1121]">{value}</p>
    </motion.div>
  );
}