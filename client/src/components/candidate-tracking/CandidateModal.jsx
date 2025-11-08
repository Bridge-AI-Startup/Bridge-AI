
import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, Mail, Phone, MapPin, Briefcase, GraduationCap, Clock, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

export default function CandidateModal({ candidate, stageId, onClose, onNext, onPrev, hasNext, hasPrev }) {
  const navigate = useNavigate();

  if (!candidate) return null;

  // Mock detailed candidate data - in production, fetch based on candidate ID
  const candidateDetails = {
    name: candidate.name,
    email: `${candidate.name.toLowerCase().replace(' ', '.')}@university.edu`,
    phone: "(555) 123-4567",
    location: "Stanford, CA",
    university: "Stanford University",
    major: "Computer Science, BS",
    graduationYear: "May 2025",
    gpa: "3.9",
    matchScore: candidate.match,
    skills: ["React.js", "Node.js", "TypeScript", "PostgreSQL", "AWS"],
    experience: "Software Engineering Intern at TechCorp (Summer 2024)",
    // Assessment data (for assessment stage)
    assessmentData: candidate.aiScore ? {
      projectTitle: "Real-time Chat Application",
      aiScore: candidate.aiScore,
      completedDate: candidate.completedDate,
      functionalCorrectness: 85,
      codeClarity: 90,
      problemSolving: 82,
      efficiency: 88
    } : null,
    // Interview data (for interview stages)
    interviewData: candidate.interviewRating ? {
      date: candidate.date,
      rating: candidate.interviewRating,
      interviewer: "Sarah Chen",
      strengths: ["Problem Solving", "Communication", "Technical Skills"],
      concerns: ["Limited backend experience"]
    } : null,
    // Offer data (for offer stage)
    offerData: candidate.offerStatus ? {
      status: candidate.offerStatus,
      sentDate: "Dec 10, 2024",
      salary: "$35/hr",
      duration: "12 weeks"
    } : null,
    // Assessment in progress data
    assessmentInProgress: (candidate.assessmentStarted && candidate.hoursLeft !== undefined) ? {
      hoursLeft: candidate.hoursLeft,
      totalHours: candidate.completionTimeAllowedHours
    } : null
  };

  const getCategoryColor = (score) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getOfferStatusColor = (status) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-700 border-green-200";
      case "declined":
        return "bg-red-100 text-red-700 border-red-200";
      case "waiting":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // Map stage to dashboard route
  const getStageDashboard = () => {
    switch (stageId) {
      case "new":
        return { path: "/ReviewMatches", label: "Assessments In Progress" };
      case "assessment":
        return { path: "/ReviewAssessments", label: "Assessments Completed" };
      case "interview-scheduled":
        return { path: "/InterviewCalendar", label: "Interview Scheduled" };
      case "interviewed":
        return { path: "/ReviewInterviews", label: "Interviewed" };
      case "offer":
        return { path: "/ReviewOffers", label: "Offers Extended" };
      default:
        return { path: "/JobListingDashboard", label: "Pipeline" };
    }
  };

  const stageDashboard = getStageDashboard();

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-2xl font-semibold text-[#0B1121]">{candidateDetails.name}</h2>
            <p className="text-[#6B7280] font-normal">{candidate.role}</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Match Score */}
            <div className="flex items-center justify-between bg-blue-50 rounded-xl p-4 border border-blue-200">
              <div>
                <p className="text-sm text-[#6B7280] font-normal mb-1">Match Score</p>
                <p className="text-2xl font-semibold text-[#1E3A8A]">{candidateDetails.matchScore}</p>
              </div>
              <Badge className="bg-[#1E3A8A] text-white px-4 py-2 text-sm">
                Strong Fit
              </Badge>
            </div>

            {/* Contact & Education */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <h3 className="font-semibold text-[#0B1121] mb-3">Contact Info</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                    <Mail className="w-4 h-4" />
                    <span className="font-normal">{candidateDetails.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                    <Phone className="w-4 h-4" />
                    <span className="font-normal">{candidateDetails.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                    <MapPin className="w-4 h-4" />
                    <span className="font-normal">{candidateDetails.location}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <h3 className="font-semibold text-[#0B1121] mb-3">Education</h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm text-[#6B7280]">
                    <GraduationCap className="w-4 h-4 mt-0.5" />
                    <div>
                      <p className="font-semibold text-[#0B1121]">{candidateDetails.university}</p>
                      <p className="font-normal">{candidateDetails.major}</p>
                      <p className="font-normal">GPA: {candidateDetails.gpa} • {candidateDetails.graduationYear}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <h3 className="font-semibold text-[#0B1121] mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {candidateDetails.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <h3 className="font-semibold text-[#0B1121] mb-2">Experience</h3>
              <div className="flex items-start gap-2 text-sm text-[#6B7280]">
                <Briefcase className="w-4 h-4 mt-0.5" />
                <p className="font-normal">{candidateDetails.experience}</p>
              </div>
            </div>

            {/* Stage-specific content */}
            {stageId === "new" && candidateDetails.assessmentInProgress && (
              <div className={`rounded-xl p-4 border-2 ${
                candidateDetails.assessmentInProgress.hoursLeft < 0
                  ? "bg-red-50 border-red-200"
                  : "bg-blue-50 border-blue-200"
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className={`w-5 h-5 ${
                    candidateDetails.assessmentInProgress.hoursLeft < 0 ? "text-red-600" : "text-blue-600"
                  }`} />
                  <h3 className="font-semibold text-[#0B1121]">Assessment in Progress</h3>
                </div>
                <p className="text-sm text-[#6B7280] font-normal">
                  {candidateDetails.assessmentInProgress.hoursLeft < 0
                    ? `Overdue by ${Math.abs(candidateDetails.assessmentInProgress.hoursLeft)} hours`
                    : `${candidateDetails.assessmentInProgress.hoursLeft} hours remaining of ${candidateDetails.assessmentInProgress.totalHours} hours`
                  }
                </p>
              </div>
            )}

            {stageId === "assessment" && candidateDetails.assessmentData && (
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="font-semibold text-[#0B1121] text-lg">Assessment Results</h3>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 rounded-full border border-blue-200">
                    <span className="text-lg text-[#1E3A8A] leading-none">
                      {candidateDetails.assessmentData.aiScore}
                    </span>
                    <span className="text-xs text-[#6B7280]">/ 100</span>
                  </div>
                </div>
                <p className="text-sm text-[#6B7280] font-normal mb-4">
                  Project: {candidateDetails.assessmentData.projectTitle}
                </p>
                <p className="text-sm text-[#6B7280] font-normal mb-4">
                  Completed: {candidateDetails.assessmentData.completedDate}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-[#6B7280] font-normal">Functional</span>
                      <span className="text-xs font-semibold text-[#0B1121]">{candidateDetails.assessmentData.functionalCorrectness}%</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full">
                      <div
                        className={`h-2 rounded-full ${getCategoryColor(candidateDetails.assessmentData.functionalCorrectness)}`}
                        style={{ width: `${candidateDetails.assessmentData.functionalCorrectness}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-[#6B7280] font-normal">Code Clarity</span>
                      <span className="text-xs font-semibold text-[#0B1121]">{candidateDetails.assessmentData.codeClarity}%</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full">
                      <div
                        className={`h-2 rounded-full ${getCategoryColor(candidateDetails.assessmentData.codeClarity)}`}
                        style={{ width: `${candidateDetails.assessmentData.codeClarity}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-[#6B7280] font-normal">Problem Solving</span>
                      <span className="text-xs font-semibold text-[#0B1121]">{candidateDetails.assessmentData.problemSolving}%</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full">
                      <div
                        className={`h-2 rounded-full ${getCategoryColor(candidateDetails.assessmentData.problemSolving)}`}
                        style={{ width: `${candidateDetails.assessmentData.problemSolving}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-[#6B7280] font-normal">Efficiency</span>
                      <span className="text-xs font-semibold text-[#0B1121]">{candidateDetails.assessmentData.efficiency}%</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full">
                      <div
                        className={`h-2 rounded-full ${getCategoryColor(candidateDetails.assessmentData.efficiency)}`}
                        style={{ width: `${candidateDetails.assessmentData.efficiency}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {stageId === "interview-scheduled" && (
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-purple-600" />
                  <h3 className="font-semibold text-[#0B1121]">Interview Scheduled</h3>
                </div>
                <p className="text-sm text-[#6B7280] font-normal">
                  {candidate.date}
                </p>
              </div>
            )}

            {stageId === "interviewed" && candidateDetails.interviewData && (
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[#0B1121] text-lg">Interview Feedback</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-semibold text-[#0B1121]">
                      {candidateDetails.interviewData.rating}/10
                    </span>
                  </div>
                </div>
                <p className="text-sm text-[#6B7280] font-normal mb-3">
                  Interviewer: {candidateDetails.interviewData.interviewer}
                </p>
                <div className="grid md:grid-cols-2 gap-3 mb-4">
                  <div>
                    <p className="text-xs font-semibold text-green-700 mb-2">Strengths</p>
                    <div className="flex flex-wrap gap-1">
                      {candidateDetails.interviewData.strengths.map((strength, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium"
                        >
                          {strength}
                        </span>
                      ))}
                    </div>
                  </div>
                  {candidateDetails.interviewData.concerns.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-red-700 mb-2">Concerns</p>
                      <div className="flex flex-wrap gap-1">
                        {candidateDetails.interviewData.concerns.map((concern, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium"
                          >
                            {concern}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {stageId === "offer" && candidateDetails.offerData && (
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <h3 className="font-semibold text-[#0B1121] mb-4">Offer Details</h3>
                <div className={`rounded-lg p-3 border mb-4 ${getOfferStatusColor(candidateDetails.offerData.status)}`}>
                  <p className="font-semibold">
                    Status: {candidateDetails.offerData.status.charAt(0).toUpperCase() + candidateDetails.offerData.status.slice(1)}
                  </p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#6B7280] font-normal">Sent:</span>
                    <span className="font-semibold text-[#0B1121]">{candidateDetails.offerData.sentDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B7280] font-normal">Hourly Rate:</span>
                    <span className="font-semibold text-[#0B1121]">{candidateDetails.offerData.salary}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B7280] font-normal">Duration:</span>
                    <span className="font-semibold text-[#0B1121]">{candidateDetails.offerData.duration}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <Button
              onClick={onPrev}
              disabled={!hasPrev}
              variant="outline"
              className="h-11 px-4"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <Button
              onClick={onNext}
              disabled={!hasNext}
              variant="outline"
              className="h-11 px-4"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => navigate(`/ApplicantProfile?name=${encodeURIComponent(candidate.name)}`)}
              variant="outline"
              className="h-11 px-5"
            >
              View Full Profile
            </Button>
            <Button
              onClick={() => navigate(stageDashboard.path)}
              className="h-11 px-5 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white"
            >
              View All in {stageDashboard.label}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
