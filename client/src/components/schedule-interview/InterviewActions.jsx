import React from "react";
import { Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InterviewActions({ 
  onCancel, 
  onSubmit, 
  canCreate, 
  isCreating 
}) {
  return (
    <div className="flex gap-3">
      <Button
        onClick={onCancel}
        variant="outline"
        className="flex-1 h-14 rounded-xl border-2 border-gray-200 hover:border-gray-300 font-medium"
      >
        Cancel
      </Button>
      <Button
        onClick={onSubmit}
        disabled={!canCreate || isCreating}
        className="flex-1 h-14 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ backgroundColor: canCreate ? '#1E3A8A' : '#E5E5E5', color: canCreate ? 'white' : '#9CA3AF' }}
      >
        {isCreating ? (
          <>
            <Clock className="w-5 h-5 mr-2 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Calendar className="w-5 h-5 mr-2" />
            Send Availability
          </>
        )}
      </Button>
    </div>
  );
}