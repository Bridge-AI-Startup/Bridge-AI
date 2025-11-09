import React from "react";
import { motion } from "framer-motion";
import { Calendar, CheckCircle2, Sparkles, X, Code, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EmployerMatchCard({ match, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-gray-300 transition-all shadow-sm"
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] flex items-center justify-center flex-shrink-0 shadow-md">
          <span className="text-2xl font-semibold text-white">{match.profileImage}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-2">
            <div className="min-w-0">
              <h3 className="text-2xl font-semibold text-[#0B1121]">{match.name}</h3>
              <p className="text-base text-[#6B7280] font-normal">{match.major}</p>
            </div>
            <div className="px-4 py-2 bg-[#1E3A8A] text-white text-base font-semibold rounded-full flex-shrink-0 self-start">
              {match.match} Match
            </div>
          </div>
        </div>
      </div>

      <p className="text-base text-[#6B7280] mb-4 leading-relaxed font-normal">
        {match.description}
      </p>

      <div className="mb-4">
        <h4 className="text-[#0B1121] font-semibold mb-3 text-sm">Skills</h4>
        <div className="flex flex-wrap gap-2">
          {match.skills.map((skill, idx) => (
            <span
              key={idx}
              className="px-3 py-1.5 bg-gray-100 text-[#0B1121] rounded-lg text-sm font-normal"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-[#0B1121] font-semibold mb-3 text-sm">Notable Projects</h4>
        <div className="flex flex-wrap gap-2">
          {match.projects.map((project, idx) => (
            <span
              key={idx}
              className="px-3 py-1.5 bg-[#1E3A8A]/5 text-[#1E3A8A] rounded-lg text-sm font-normal border border-[#1E3A8A]/20"
            >
              {project}
            </span>
          ))}
        </div>
      </div>

      <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 mb-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-[#1E3A8A]" />
          </div>
          <div className="min-w-0">
            <p className="text-[#0B1121] font-semibold mb-1 text-sm">Why this is a great match</p>
            <p className="text-[#6B7280] text-sm leading-relaxed font-normal">
              {match.insight}
            </p>
          </div>
        </div>
      </div>

      {match.actionType === "interview_scheduled" ? (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="text-green-800 font-semibold">Interview scheduled for {match.interviewDate}</p>
        </div>
      ) : match.actionType === "project_assigned" ? (
        <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <Code className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <p className="text-blue-800 font-semibold">Project assigned: {match.projectName}</p>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-3">
          <Button className="flex-1 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white h-12 rounded-xl">
            <Calendar className="w-5 h-5 mr-2" />
            Schedule Interview
          </Button>
          <Button className="flex-1 bg-gray-200 hover:bg-gray-300 text-[#0B1121] h-12 rounded-xl">
            <Code className="w-5 h-5 mr-2" />
            Assign Project
          </Button>
          <Button variant="outline" className="sm:w-auto bg-white hover:bg-gray-50 text-[#6B7280] hover:text-[#0B1121] border-gray-300 rounded-xl h-12 px-6">
            <X className="w-5 h-5 mr-2" />
            Deny
          </Button>
        </div>
      )}
    </motion.div>
  );
}