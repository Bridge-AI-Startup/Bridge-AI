import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ComparisonCard({ title, candidateA, candidateB, verdict, onViewCandidate }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-200 p-5 mb-4"
    >
      <h3 className="text-base font-semibold text-[#0B1121] mb-4">{title}</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
          <p className="font-semibold text-[#0B1121] text-sm mb-2">{candidateA.name}</p>
          <div className="space-y-1.5">
            <p className="text-xs text-[#6B7280] font-normal">Strengths:</p>
            {candidateA.strengths.map((strength, idx) => (
              <div key={idx} className="flex items-start gap-1.5">
                <TrendingUp className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-[#0B1121]">{strength}</p>
              </div>
            ))}
            <p className="text-xs text-[#6B7280] font-normal mt-2">Weaknesses:</p>
            {candidateA.weaknesses.map((weakness, idx) => (
              <div key={idx} className="flex items-start gap-1.5">
                <TrendingDown className="w-3 h-3 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-[#0B1121]">{weakness}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
          <p className="font-semibold text-[#0B1121] text-sm mb-2">{candidateB.name}</p>
          <div className="space-y-1.5">
            <p className="text-xs text-[#6B7280] font-normal">Strengths:</p>
            {candidateB.strengths.map((strength, idx) => (
              <div key={idx} className="flex items-start gap-1.5">
                <TrendingUp className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-[#0B1121]">{strength}</p>
              </div>
            ))}
            <p className="text-xs text-[#6B7280] font-normal mt-2">Weaknesses:</p>
            {candidateB.weaknesses.map((weakness, idx) => (
              <div key={idx} className="flex items-start gap-1.5">
                <TrendingDown className="w-3 h-3 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-[#0B1121]">{weakness}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
        <p className="text-xs font-semibold text-[#1E3A8A] mb-1">Verdict</p>
        <p className="text-sm text-[#0B1121]">{verdict}</p>
      </div>

      <div className="flex gap-2 mt-4">
        <Button
          onClick={() => onViewCandidate?.(candidateA.id)}
          variant="outline"
          size="sm"
          className="h-8 text-xs flex-1"
        >
          View {candidateA.name}
        </Button>
        <Button
          onClick={() => onViewCandidate?.(candidateB.id)}
          variant="outline"
          size="sm"
          className="h-8 text-xs flex-1"
        >
          View {candidateB.name}
        </Button>
      </div>
    </motion.div>
  );
}