import React from "react";
import { motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

export default function TableRow({ candidate, isSelected, onToggle, delay }) {
  const stageColors = {
    "New": "bg-blue-50 text-blue-700 border-blue-200",
    "Interview Scheduled": "bg-purple-50 text-purple-700 border-purple-200",
    "Assessment": "bg-yellow-50 text-yellow-700 border-yellow-200",
    "Interviewed": "bg-green-50 text-green-700 border-green-200",
    "Offer": "bg-pink-50 text-pink-700 border-pink-200"
  };

  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="hover:bg-gray-50 transition-colors"
    >
      <td className="px-6 py-4">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggle(candidate.id)}
        />
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] flex items-center justify-center">
            <span className="text-white text-sm font-semibold">
              {candidate.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <span className="font-semibold text-[#0B1121]">{candidate.name}</span>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-[#6B7280] font-normal">{candidate.role}</td>
      <td className="px-6 py-4">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${stageColors[candidate.stage]}`}>
          {candidate.stage}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className="px-3 py-1 bg-[#1E3A8A] text-white text-xs font-semibold rounded-full">
          {candidate.match}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-[#6B7280] font-normal">{candidate.applied}</td>
      <td className="px-6 py-4 text-sm text-[#6B7280] font-normal">{candidate.lastActivity}</td>
      <td className="px-6 py-4 text-right">
        <Button variant="ghost" size="sm" className="h-8">
          View
        </Button>
      </td>
    </motion.tr>
  );
}