import React from "react";
import { Mail, GraduationCap, MapPin } from "lucide-react";

export default function CandidateInfo({ candidate }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] flex items-center justify-center flex-shrink-0">
          <span className="text-white text-2xl font-semibold">
            {candidate.name.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-semibold text-[#0B1121] mb-2">
            {candidate.name}
          </h2>
          <div className="space-y-1 text-[#6B7280]">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-normal truncate">{candidate.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-normal">{candidate.major}, {candidate.university}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-normal">{candidate.location}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}