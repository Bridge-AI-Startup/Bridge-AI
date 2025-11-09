
import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, Calendar, FileCheck, XCircle, Award, ExternalLink, Github, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function MatchDetailsPanel({ candidate, onClose }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [notes, setNotes] = useState("");

  const getMatchScoreColor = (score) => {
    if (score >= 90) return "bg-green-500 text-white";
    if (score >= 75) return "bg-[#FFFF00] text-[#0B1121]";
    return "bg-red-500 text-white";
  };

  const getAssessmentStatus = (status) => {
    const statuses = {
      not_started: { label: "Not Started", className: "bg-gray-100 text-gray-700" },
      in_progress: { label: "In Progress", className: "bg-blue-100 text-blue-700" },
      completed: { label: "Completed", className: "bg-green-100 text-green-700" }
    };
    return statuses[status] || statuses.not_started;
  };

  const assessmentStatus = getAssessmentStatus(candidate.assessmentStatus);

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "projects", label: "Projects & Portfolio" },
    { id: "skills", label: "Skills" },
    { id: "assessment", label: "Assessment" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-end"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25 }}
        className="bg-white h-full w-full max-w-2xl overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] flex items-center justify-center">
                <span className="text-white text-xl font-semibold">
                  {candidate.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-[#0B1121] mb-1">
                  {candidate.name}
                </h2>
                <p className="text-[#6B7280] font-normal">
                  {candidate.university} • '{candidate.gradYear.slice(-2)}
                </p>
                <p className="text-sm text-[#6B7280] font-normal">
                  {candidate.role}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className={`px-4 py-2 rounded-lg font-bold text-lg ${getMatchScoreColor(candidate.matchScore)}`}>
                {candidate.matchScore}%
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              className="flex-1 h-10 rounded-xl font-medium bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Invite to Interview
            </Button>
            <Button
              variant="outline"
              className="flex-1 h-10 rounded-xl border-2 border-[#1E3A8A] text-[#1E3A8A]"
            >
              <FileCheck className="w-4 h-4 mr-2" />
              Assign Assessment
            </Button>
            <Button
              variant="outline"
              className="h-10 px-4 rounded-xl border-2 border-gray-200 hover:border-red-500 hover:text-red-600"
            >
              <XCircle className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 px-6">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-[#1E3A8A]'
                    : 'text-[#6B7280] hover:text-[#0B1121]'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1E3A8A]"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-[#0B1121] mb-3">Why this match</h3>
                <p className="text-[#6B7280] font-normal leading-relaxed">
                  {candidate.matchReason}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-[#0B1121] mb-2">Availability</h4>
                  <p className="text-sm text-[#6B7280] font-normal">{candidate.availability}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#0B1121] mb-2">Location</h4>
                  <p className="text-sm text-[#6B7280] font-normal">{candidate.location}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#0B1121] mb-2">Timezone</h4>
                  <p className="text-sm text-[#6B7280] font-normal">{candidate.timezone}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#0B1121] mb-2">Visa Status</h4>
                  <p className="text-sm text-[#6B7280] font-normal">{candidate.visa}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-[#0B1121] mb-3">Links</h4>
                <div className="flex gap-2">
                  {candidate.hasGithub && (
                    <a
                      href="#"
                      className="px-4 py-2 bg-[#1E3A8A]/10 text-[#1E3A8A] rounded-xl font-semibold flex items-center gap-2 hover:bg-[#1E3A8A]/20 transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      GitHub Profile
                    </a>
                  )}
                  {candidate.hasPortfolio && (
                    <a
                      href="#"
                      className="px-4 py-2 bg-[#1E3A8A]/10 text-[#1E3A8A] rounded-xl font-semibold flex items-center gap-2 hover:bg-[#1E3A8A]/20 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Portfolio
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "projects" && (
            <div className="space-y-4">
              <h3 className="font-semibold text-[#0B1121] mb-3">Projects & Portfolio</h3>
              {candidate.projects.map((project, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-[#0B1121]">{project.title}</h4>
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1E3A8A] hover:text-[#1E3A8A]/80"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                  <p className="text-sm text-[#6B7280] font-normal">
                    {project.description}
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "skills" && (
            <div className="space-y-4">
              <h3 className="font-semibold text-[#0B1121] mb-3">Skills Breakdown</h3>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-[#1E3A8A]/10 text-[#1E3A8A] rounded-xl font-semibold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {activeTab === "assessment" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-[#0B1121]">Assessment Status</h3>
                <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${assessmentStatus.className}`}>
                  {assessmentStatus.label}
                </span>
              </div>
              
              {candidate.assessmentStatus === "completed" && candidate.assessmentScore && (
                <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-green-700">Assessment Score</span>
                    <span className="text-2xl font-bold text-green-700">{candidate.assessmentScore}/100</span>
                  </div>
                  <div className="w-full bg-green-200 h-2 rounded-full">
                    <div
                      className="h-2 rounded-full bg-green-500"
                      style={{ width: `${candidate.assessmentScore}%` }}
                    />
                  </div>
                </div>
              )}

              {candidate.assessmentStatus === "not_started" && (
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center">
                  <p className="text-[#6B7280] font-normal mb-4">
                    No assessment assigned yet
                  </p>
                  <Button
                    className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white"
                  >
                    <FileCheck className="w-4 h-4 mr-2" />
                    Assign Assessment
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
          <h3 className="font-semibold text-[#0B1121] mb-3">Internal Notes</h3>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add private notes about this candidate..."
            className="min-h-[100px] rounded-xl mb-3"
          />
          <Button className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white h-11 rounded-xl">
            <Save className="w-4 h-4 mr-2" />
            Save Note
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
