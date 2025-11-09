import React from "react";
import { motion } from "framer-motion";
import { Clock, Video, MapPin, Users } from "lucide-react";

export default function CandidateInfoSidebar({ candidate, duration, locationType, locationDetails, interviewersCount }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 border border-gray-200 sticky top-24"
    >
      <div className={`w-20 h-20 rounded-2xl ${candidate.bgColor} flex items-center justify-center mb-4`}>
        <span className="text-white text-2xl font-semibold">
          {candidate.initials}
        </span>
      </div>
      
      <h2 className="text-2xl font-semibold text-[#0B1121] mb-1">
        {candidate.name}
      </h2>
      <p className="text-[#6B7280] mb-2 font-normal">{candidate.role}</p>
      <p className="text-sm text-[#6B7280] font-normal">{candidate.email}</p>

      <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
        <div>
          <p className="text-sm font-semibold text-[#0B1121] mb-3">Interview Summary</p>
          <div className="space-y-2 text-sm text-[#6B7280]">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{duration} minutes</span>
            </div>
            <div className="flex items-center gap-2">
              {locationType === "video" ? <Video className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
              <span>{locationType === "video" ? "Video call" : locationDetails || "TBD"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{interviewersCount} interviewer{interviewersCount !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}