import React from "react";
import { Clock, AlertCircle } from "lucide-react";

export default function TimeAllotment({ duration }) {
  return (
    <div className="mb-8 bg-gradient-to-br from-[#1E3A8A]/5 to-[#1E3A8A]/10 rounded-2xl p-6 border-2 border-[#1E3A8A]/30">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#1E3A8A] flex items-center justify-center flex-shrink-0">
          <Clock className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-[#0B1121] mb-2">
            Time allotted: {duration}
          </h3>
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-[#1E3A8A] mt-0.5 flex-shrink-0" />
            <p className="text-[#6B7280] font-normal">
              Once you start, this timer begins — it cannot be paused.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}