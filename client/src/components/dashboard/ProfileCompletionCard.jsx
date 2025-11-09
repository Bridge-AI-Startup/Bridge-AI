import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, CheckCircle2, AlertCircle } from "lucide-react";

export default function ProfileCompletionCard({ 
  completionPercentage, 
  completionSections 
}) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="mb-8 bg-gradient-to-br from-[#1E3A8A]/5 to-[#1E3A8A]/10 rounded-2xl p-6 border-2 border-[#1E3A8A]/30"
    >
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-[#1E3A8A] flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#0B1121]">
                Complete Your Profile
              </h3>
              <p className="text-sm text-[#6B7280] font-normal">
                {completionPercentage}% complete
              </p>
            </div>
          </div>
          
          <p className="text-[#0B1121] font-normal mb-4">
            Unlock more relevant matches and get seen by top startups by completing your profile!
          </p>

          <div className="flex flex-wrap gap-3 mb-4">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${
              completionSections.resume 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              {completionSections.resume ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              <span className="font-medium">Resume/LinkedIn</span>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${
              completionSections.projects 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              {completionSections.projects ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              <span className="font-medium">Projects</span>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${
              completionSections.preferences 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              {completionSections.preferences ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              <span className="font-medium">Preferences</span>
            </div>
          </div>

          <Button
            onClick={() => navigate("/Profile")}
            className="h-12 px-8 rounded-xl bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-medium"
          >
            Complete Profile Now
          </Button>
        </div>

        <div className="hidden md:flex flex-col items-center justify-center">
          <div className="relative w-24 h-24">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-gray-200"
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - completionPercentage / 100)}`}
                className="text-[#1E3A8A] transition-all duration-1000"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-semibold text-[#1E3A8A]">
                {completionPercentage}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}