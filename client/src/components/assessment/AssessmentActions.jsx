import React from "react";
import { Button } from "@/components/ui/button";
import { Play, Bell } from "lucide-react";

export default function AssessmentActions({ onStart, onRemindLater }) {
  return (
    <div className="space-y-4">
      <Button
        onClick={onStart}
        className="w-full h-16 text-lg font-semibold rounded-xl bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white shadow-lg hover:shadow-xl transition-all"
      >
        <Play className="w-5 h-5 mr-2" />
        Start Assessment
      </Button>
      
      <button
        onClick={onRemindLater}
        className="w-full text-[#6B7280] hover:text-[#0B1121] font-normal text-sm transition-colors flex items-center justify-center gap-2"
      >
        <Bell className="w-4 h-4" />
        Remind me later
      </button>
    </div>
  );
}