import React from "react";
import { FileText, Clock, Play, Upload, BookOpen } from "lucide-react";

export default function AssessmentInstructions() {
  const instructions = [
    {
      icon: FileText,
      text: "You'll see the project brief once you begin."
    },
    {
      icon: Clock,
      text: "You'll have 2 hours to complete and submit your work."
    },
    {
      icon: Play,
      text: "Your timer starts immediately after you press Start Assessment."
    },
    {
      icon: Upload,
      text: "You may work locally or in-browser and upload your results."
    },
    {
      icon: BookOpen,
      text: "Allowed: documentation, personal notes. Not allowed: copying public code."
    }
  ];

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-[#0B1121] mb-4">
        Instructions
      </h3>
      <div className="space-y-3">
        {instructions.map((item, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <item.icon className="w-4 h-4 text-[#1E3A8A]" />
            </div>
            <p className="text-[#0B1121] font-normal leading-relaxed">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}