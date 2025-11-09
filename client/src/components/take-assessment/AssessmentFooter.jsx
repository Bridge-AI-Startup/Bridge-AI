import React from "react";
import { Button } from "@/components/ui/button";
import { Send, Save } from "lucide-react";

export default function AssessmentFooter({ onSubmit, onSaveProgress, isLocked, canSubmit }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-3xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={onSaveProgress}
            disabled={isLocked}
            className={`flex items-center gap-2 text-sm font-normal transition-colors ${
              isLocked
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-[#6B7280] hover:text-[#0B1121]'
            }`}
          >
            <Save className="w-4 h-4" />
            Save Progress
          </button>

          <Button
            onClick={onSubmit}
            disabled={isLocked || !canSubmit}
            className="h-12 px-8 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5 mr-2" />
            Submit Assessment
          </Button>
        </div>
      </div>
    </div>
  );
}