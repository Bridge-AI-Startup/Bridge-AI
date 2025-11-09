import React from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function InterviewersSection({
  interviewers,
  newInterviewerName,
  setNewInterviewerName,
  newInterviewerEmail,
  setNewInterviewerEmail,
  addInterviewer,
  removeInterviewer
}) {
  return (
    <>
      <label className="block text-sm font-semibold text-[#0B1121] mb-3">
        Add Interviewers
      </label>
      <div className="space-y-3 mb-3">
        <Input
          placeholder="Interviewer name"
          value={newInterviewerName}
          onChange={(e) => setNewInterviewerName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addInterviewer()}
          className="h-12"
        />
        <div className="flex gap-2">
          <Input
            placeholder="Email address"
            type="email"
            value={newInterviewerEmail}
            onChange={(e) => setNewInterviewerEmail(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addInterviewer()}
            className="h-12 flex-1"
          />
          <Button
            onClick={addInterviewer}
            className="h-12 px-6 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white rounded-xl"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
      {interviewers.length > 0 && (
        <div className="space-y-2">
          {interviewers.map((interviewer) => (
            <div
              key={interviewer.email}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200"
            >
              <div>
                <p className="text-sm text-[#0B1121] font-semibold">{interviewer.name}</p>
                <p className="text-xs text-[#6B7280] font-normal">{interviewer.email}</p>
              </div>
              <button
                onClick={() => removeInterviewer(interviewer.email)}
                className="text-[#6B7280] hover:text-red-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}