
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Calendar, Clock, FileText, Award, CheckCircle, ChevronLeft, ChevronRight, ExternalLink, Briefcase, Building2, Users, DollarSign, Sparkles, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CompanyLogo from "../dashboard/CompanyLogo";

export default function StudentApplicationModal({ application, onClose, onNext, onPrev, hasNext, hasPrev, stageId }) {
  const navigate = useNavigate();

  const handleBookInterview = () => {
    navigate("/BookInterview", {
      state: {
        from: "StudentPipeline",
        companyName: application.company,
        jobRole: application.role
      }
    });
    onClose();
  };

  const handleStartAssessment = () => {
    navigate("/StartAssessment", {
      state: {
        from: "StudentPipeline",
        companyName: application.company,
        jobRole: application.role
      }
    });
    onClose();
  };

  const handleContinueAssessment = () => {
    navigate("/TakeAssessment", {
      state: {
        from: "StudentPipeline",
        companyName: application.company,
        jobRole: application.role
      }
    });
    onClose();
  };

  const handleViewJobDetails = () => {
    navigate(`/JobAnalysis?company=${encodeURIComponent(application.name)}`, {
      state: { from: "StudentPipeline" }
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.98 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Clean Header - Single Row */}
          <div className="px-8 py-6 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-start justify-between gap-6">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <CompanyLogo type={application.logo} size="normal" />
                <div className="flex-1 min-w-0">
                  <h2 
                    onClick={handleViewJobDetails}
                    className="text-2xl font-semibold text-[#0B1121] mb-1 truncate cursor-pointer hover:text-[#1E3A8A] transition-colors"
                  >
                    {application.name}
                  </h2>
                  <div className="flex items-center gap-3 text-sm text-[#6B7280]">
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4" />
                      {application.role}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      {application.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Compact Stat Badges */}
              <div className="flex items-start gap-3 flex-shrink-0">
                <div className="flex flex-col items-end gap-2">
                  <Badge className="bg-[#1E3A8A] text-white px-4 py-1.5 text-base font-semibold hover:bg-[#1E3A8A]">
                    {application.match}
                  </Badge>
                </div>

                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors flex-shrink-0"
                >
                  <X className="w-5 h-5 text-[#6B7280]" />
                </button>
              </div>
            </div>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto px-8">
            {/* Section 1: Key Info Cards */}
            <div className="py-6 space-y-4">
              {/* Assessment/Interview/Offer Card */}
              {stageId === "new" && (
                <div className="bg-[#F9FAFB] rounded-2xl p-5 border border-gray-200 shadow-sm">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-[#1E3A8A]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#0B1121] mb-1">Assessment Project</h3>
                      {application.assessmentStatus === "completed" ? (
                        <p className="text-sm text-[#6B7280]">
                          Completed on <span className="font-medium text-[#0B1121]">{application.completedDate}</span>
                        </p>
                      ) : (
                        <p className="text-sm text-[#6B7280]">
                          Complete a technical assessment to move forward
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {application.assessmentStatus === "completed" ? (
                    <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-green-200">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-green-800">Submitted successfully — under review</span>
                    </div>
                  ) : (
                    <>
                      <div className={`flex items-center justify-between p-3 rounded-xl border mb-4 ${
                        application.assessmentStarted 
                          ? 'bg-yellow-50 border-yellow-400' 
                          : 'bg-white border-gray-200'
                      }`}>
                        <span className="text-sm font-medium text-[#0B1121]">
                          {application.assessmentStarted ? "Time Left" : "Time Allowed"}
                        </span>
                        <span className="text-sm text-[#6B7280]">
                          {application.assessmentStarted && application.hoursLeft > 0 
                            ? `${application.hoursLeft} hours` 
                            : `${application.completionTimeAllowedHours} hours`}
                        </span>
                      </div>
                      
                      {!application.assessmentStarted ? (
                        <Button 
                          onClick={handleStartAssessment}
                          className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white h-11 rounded-xl font-medium"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Start Assessment
                        </Button>
                      ) : application.hoursLeft > 0 ? (
                        <Button 
                          onClick={handleContinueAssessment}
                          className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white h-11 rounded-xl font-medium"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Continue Assessment
                        </Button>
                      ) : null}
                    </>
                  )}
                </div>
              )}

              {stageId === "interview" && (
                <div className="bg-[#F9FAFB] rounded-2xl p-5 border border-gray-200 shadow-sm">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-purple-700" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#0B1121] mb-1">Interview</h3>
                      {application.interviewStatus === "scheduled" && (
                        <p className="text-sm text-[#6B7280]">
                          Scheduled for <span className="font-medium text-[#0B1121]">{application.date}</span>
                        </p>
                      )}
                      {application.interviewStatus === "needsScheduling" && (
                        <p className="text-sm text-[#6B7280]">
                          Schedule your interview to continue
                        </p>
                      )}
                      {application.interviewStatus === "completed" && (
                        <p className="text-sm text-[#6B7280]">
                          Completed on <span className="font-medium text-[#0B1121]">{application.date}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {application.interviewStatus === "scheduled" && (
                    <Button className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white rounded-xl h-11">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Join Interview
                    </Button>
                  )}

                  {application.interviewStatus === "needsScheduling" && (
                    <Button 
                      onClick={handleBookInterview}
                      className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white rounded-xl h-11">
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Interview
                    </Button>
                  )}

                  {application.interviewStatus === "completed" && (
                    <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-green-200">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-green-800">Interview completed</span>
                    </div>
                  )}
                </div>
              )}

              {stageId === "offer" && (
                <div className="bg-[#F9FAFB] rounded-2xl p-5 border border-gray-200 shadow-sm">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <Award className="w-5 h-5 text-emerald-700" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#0B1121] mb-1">Offer Extended</h3>
                      <p className="text-sm text-[#6B7280]">
                        Received {application.date}
                      </p>
                    </div>
                  </div>

                  {application.offerStatus === "waiting" && (
                    <div className="flex gap-3">
                      <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-11">
                        Accept Offer
                      </Button>
                      <Button variant="outline" className="flex-1 border-2 rounded-xl h-11">
                        Decline
                      </Button>
                    </div>
                  )}

                  {application.offerStatus === "accepted" && (
                    <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-emerald-200">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                      <span className="text-sm font-medium text-emerald-800">You accepted this offer</span>
                    </div>
                  )}
                </div>
              )}

              {/* Company Info Card with About the Role */}
              <div className="bg-[#F9FAFB] rounded-2xl p-5 border border-gray-200 shadow-sm">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-5 h-5 text-[#0B1121]" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-[#0B1121]">Company Info</h3>
                        <button
                          onClick={handleViewJobDetails}
                          className="text-sm text-[#1E3A8A] hover:text-[#1E3A8A]/80 font-medium transition-colors flex items-center gap-1"
                        >
                          View Job Details
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {application.industry && (
                          <div className="flex flex-col">
                            <span className="text-xs text-[#6B7280] mb-1">Industry</span>
                            <span className="text-sm font-medium text-[#0B1121]">{application.industry}</span>
                          </div>
                        )}
                        {application.companySize && (
                          <div className="flex flex-col">
                            <span className="text-xs text-[#6B7280] mb-1">Size</span>
                            <span className="text-sm font-medium text-[#0B1121]">{application.companySize} employees</span>
                          </div>
                        )}
                        {application.fundingStage && (
                          <div className="flex flex-col">
                            <span className="text-xs text-[#6B7280] mb-1">Funding</span>
                            <span className="text-sm font-medium text-[#0B1121]">{application.fundingStage}</span>
                          </div>
                        )}
                        {application.location && (
                          <div className="flex flex-col">
                            <span className="text-xs text-[#6B7280] mb-1">Location</span>
                            <span className="text-sm font-medium text-[#0B1121]">{application.location}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {application.description && (
                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Briefcase className="w-4 h-4 text-[#1E3A8A]" />
                          <h4 className="font-semibold text-[#0B1121] text-sm">About the Role</h4>
                        </div>
                        <p className="text-sm text-[#6B7280] leading-relaxed">
                          {application.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Subtle Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
          </div>

          {/* Footer - Navigation */}
          <div className="px-8 py-5 border-t border-gray-100 flex items-center justify-between flex-shrink-0 bg-gray-50/50">
            <div className="flex items-center gap-2">
              <Button
                onClick={onPrev}
                disabled={!hasPrev}
                variant="ghost"
                size="sm"
                className="h-9 px-3 rounded-lg disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              <Button
                onClick={onNext}
                disabled={!hasNext}
                variant="ghost"
                size="sm"
                className="h-9 px-3 rounded-lg disabled:opacity-40"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <Button
              onClick={onClose}
              variant="outline"
              size="sm"
              className="h-9 px-5 rounded-lg border-2 hover:bg-gray-100"
            >
              Close
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
