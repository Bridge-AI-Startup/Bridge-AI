import React from "react";
import { Textarea } from "@/components/ui/textarea";

export default function InterviewNotes({ notes, setNotes }) {
  return (
    <>
      <label className="block text-sm font-semibold text-[#0B1121] mb-2">
        Additional Notes (Optional)
      </label>
      <Textarea
        placeholder="Add any additional information for the candidate..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="min-h-[100px]"
      />
    </>
  );
}